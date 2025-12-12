const admin = require("../firebase");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const idToken = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
