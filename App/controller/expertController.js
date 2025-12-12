const ExpertProfile = require("../model/expertProfile");
const User = require("../model/user");

exports.createExpertProfile = async (req, res) => {
  try {
    const { userId, expertiseAreas, experienceYears, bio, fee } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user.expertProfile) return res.status(400).json({ message: "Expert profile already exists" });

    const expertProfile = await ExpertProfile.create({
      userId,
      expertiseAreas: expertiseAreas || [],
      experienceYears: experienceYears || 0,
      bio: bio || "",
      fee: fee || 50,
      available: true
    });

    user.expertProfile = expertProfile._id;
    await user.save();

    const populatedUser = await User.findById(userId).populate("expertProfile");

    res.status(201).json({
      message: "Expert profile created",
      user: populatedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getExpertProfileByUser = async (req, res) => {
  try {

    const expertProfile = await ExpertProfile.find();

    if (!expertProfile) return res.status(404).json({ message: "Expert profile not found" });

    res.status(200).json({
      message: "Expert profile fetched",
      expertProfile
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
