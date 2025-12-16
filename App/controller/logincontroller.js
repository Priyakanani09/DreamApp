const User = require("../model/register");

exports.logindata = async (req, res) => {
  try {
    const decoded = req.user;

    const { fcmToken, platform } = req.body;

    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered"
      });
    }
    
    user.fcmToken = fcmToken;
    user.platform = platform;
    user.lastLoginAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getLogin = async (req, res) => {
  try {
    const user = await User.find();

    if (!user) return res.status(404).json({ message: "login fail" });

    res.status(200).json({
      message: "login successfully",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
