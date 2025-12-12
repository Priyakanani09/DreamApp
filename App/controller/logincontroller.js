const User = require("../model/register");

exports.logindata = async (req, res) => {
  try {
    const decoded = req.user; 
    const { email, phone } = req.body;

    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    if (email) {
      if (user.email !== email) {
        return res.status(400).json({
          success: false,
          message: "Email does not match registered email"
        });
      }

      return res.json({
        success: true,
        message: "Login successful with Email",
        user
      });
    }

    if (phone) {
      if (user.phone !== phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number does not match registered phone"
        });
      }

      return res.json({
        success: true,
        message: "Login successful with Phone",
        user
      });
    }

    return res.status(400).json({
      success: false,
      message: "Please send email or phone to login"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
