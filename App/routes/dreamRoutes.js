const express = require("express");
const router = express.Router();
const admin = require("../firebase");
const auth = require("../middlewares/verifyAuth");
const db = admin.firestore();

const ALL_STATUSES = [
  "pending",
  "requested",
  "in-session",
  "completed",
];

router.post("/dreams", auth, async (req, res) => {
  const { description, category, status } = req.body;
  const uid = req.user.uid;

  try {
    if (!ALL_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }
    const snap = await db
      .collection("dreams")
      .where("userId", "==", uid)
      .where("status", "in", ALL_STATUSES)
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
      status,
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
      .where("status", "in", ALL_STATUSES)
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

router.post("/dreams/user-request", auth, async (req, res) => {
  const uid = req.user.uid;
  const { dreamId } = req.body;

  try {
    const ref = db.collection("dreams").doc(dreamId);
    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({ message: "Dream not found" });
    }

    const dream = snap.data();

    if (dream.userId !== uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (dream.status !== "pending") {
      return res.status(409).json({
        message: "Dream already requested or processed",
      });
    }
    await ref.update({
      status: "analyzing",
      updatedAt: new Date(),
    });

    return res.json({
      success: true,
      dreamId,
      status: "analyzing",
      description: dream.description,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
