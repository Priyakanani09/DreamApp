const express = require("express");
const router = express.Router();
const admin = require("../firebase");
const auth = require("../middlewares/verifyAuth");
const db = admin.firestore();

// const ALL_STATUSES = ["pending", "requested", "in-session", "completed","analyzing","analyzed"];
const ACTIVE_STATUSES = ["pending", "requested", "in-session", "analyzing"];

router.post("/dreams", auth, async (req, res) => {
  const { description, category } = req.body;
  const uid = req.user.uid;

  try {
    const snap = await db
      .collection("dreams")
      .where("userId", "==", uid)
      .where("status", "in", ACTIVE_STATUSES)
      .limit(1)
      .get();

    if (!snap.empty) {
      return res.status(409).json({
        message: "User already has an active dream",
      });
    }

    const docRef = await db.collection("dreams").add({
      userId: uid,
      description,
      category,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expertId: null,
      aiAnalysis: null,
    });

    return res.status(201).json({
      success: true,
      dreamId: docRef.id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/dreams/active", auth, async (req, res) => {
  const uid = req.user.uid;

  try {
    const snap = await db
      .collection("dreams")
      .where("userId", "==", uid)
      .where("status", "in", ACTIVE_STATUSES)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.json({ hasActiveDream: false });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    return res.json({
      hasActiveDream: true,
      dreamId: doc.id,
      status: data.status,
      category: data.category,
      createdAt: data.createdAt,
      expertId: data.expertId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/dreams/run-ai", auth, async (req, res) => {
  const uid = req.user.uid;
  const { dreamId } = req.body;

  try {
    const ref = db.collection("dreams").doc(dreamId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ message: "Dream not found" });
    }

    const dream = snap.data();

    // Ownership check
    if (dream.userId !== uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Status check
    if (dream.status !== "pending") {
      return res.status(409).json({
        message: "Dream already requested or processed",
      });
    }

    // Update → analyzing
    await ref.update({
      status: "analyzing",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const dreamText = dream.description;

    const prompt = `
      You are a dream analysis expert.

      Analyze the dream and respond with:
      Summary, Meaning, Emotion, Reflection.

      - Use neutral, non-judgmental language
      - Avoid absolute claims (may, might, could)
      - Do NOT give medical, psychological, spiritual, or future predictions
      - Do NOT instruct the user what to do
      - Keep the tone supportive and grounded

      Dream:
      "${dreamText}"
      `;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      },
    );

    const result = await response.json();
    const generatedText = result[0]?.generated_text || "";

    const aiAnalysis = {
      summary: generatedText.slice(0, 200),
      possibleMeaning: generatedText.slice(200, 400),
      emotionalInsight: "The primary emotion reflected in the dream",
      reflectionQuestion:
        "What part of your waking life might connect with this dream?",
      analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update({
      status: "analyzed",
      aiAnalysis,
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
