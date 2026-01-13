const express = require("express");
const router = express.Router();

const admin = require("../firebase");
const auth = require("../middlewares/verifyAuth");
const db = admin.firestore();

router.post("/dreams", auth, async (req, res) => {
  const { description, category } = req.body;
  const uid = req.user.uid;

  try {
    const snap = await db
      .collection("dreams")
      .where("userId", "==", uid)
      .where("status", "in", ["pending", "requested", "in-session"])
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
      .where("status", "in", ["pending", "requested", "in-session"])
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

module.exports = router;
