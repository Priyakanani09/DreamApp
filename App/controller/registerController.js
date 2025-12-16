const User = require("../model/register");

exports.register = async (req, res) => {
  try {
    const decoded = req.user; 

    // const exists = await User.findOne({ uid: decoded.uid });
    // if (exists) {
    //   return res.json({ message: "User already exists" });
    // }

    await User.create({
      // uid: decoded.uid,
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

exports.getregister = async (req, res) => {
  try {
    const user = await User.find();

    if (!user) return res.status(404).json({ message: "register fail" });

    res.status(200).json({
      message: "register successfully",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};