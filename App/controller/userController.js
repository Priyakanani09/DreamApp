const User = require("../model/user");
const ExpertProfile = require("../model/expertProfile");

exports.createprofile = async (req, res) => { 
    try {
    const decoded = req.user; 
    const { name, username, gender, dob, avatarUrl, role } = req.body;

    const existingUser = await User.findOne({ uid });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      uid : decoded.uid,
      email : decoded.email,
      phone : decoded.phone,
      name,
      username,
      gender,
      dob : dob ? new Date(dob) : null,
      avatarUrl,
      termsAccepted
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find().populate("expertProfile");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User fetched successfully",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const decoded = req.user;
    const uid = decoded.uid;

    const deletedUser = await User.findOneAndDelete({ uid : uid});
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User deleted successfully",
      user: deletedUser
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const decoded = req.user;
    const uid = decoded.uid;

    const updatedUser = await User.findOneAndUpdate({ uid : uid },req.body ,{ new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({message: "User updated successfully",updatedUser});

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};