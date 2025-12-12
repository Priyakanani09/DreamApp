const User = require("../model/register");

exports.register = async (req, res) => {
  try {
    const decoded = req.user; 

    const exists = await User.findOne({ uid: decoded.uid });
    if (exists) {
      return res.json({ message: "User already exists" });
    }

    await User.create({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
      phone: decoded.phone_number,
      phoneVerified: decoded.phone_number_verified,
      createdAt: new Date()
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};