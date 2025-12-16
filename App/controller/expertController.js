const ExpertProfile = require("../model/expertProfile");
const User = require("../model/user");

exports.createExpertProfile = async (req, res) => {
  try {
    const decoded = req.user;
    const { expertiseAreas, experienceYears, bio, paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "Payment not verified" });
    }

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyApplied = await ExpertApplication.findOne({
      userId: user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await ExpertApplication.create({
      userId: user._id,
      expertiseAreas,
      experienceYears,
      bio,
      paymentId,
    });

    user.expertStatus = "pending";
    user.role = "user";
    await user.save();

    res.status(200).json({
      message: "Payment verified & application submitted",
      expertStatus: "pending",
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpertProfileByUser = async (req, res) => {
  try {
    const expertProfile = await ExpertProfile.find();

    if (!expertProfile)
      return res.status(404).json({ message: "Expert profile not found" });

    res.status(200).json({
      message: "Expert profile fetched",
      expertProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};