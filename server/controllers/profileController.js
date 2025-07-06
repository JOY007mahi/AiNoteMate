const UserProfile = require("../models/Profile");

const updateProfile = async (req, res) => {
  try {
    const { name, email, university, major } = req.body;
    const avatarUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    let profile = await UserProfile.findOne({ email });

    if (!profile) {
      profile = new UserProfile({ name, email, university, major, avatarUrl });
    } else {
      profile.name = name;
      profile.university = university;
      profile.major = major;
      if (avatarUrl) profile.avatarUrl = avatarUrl;
    }

    await profile.save();
    res.json({ message: "Profile updated", profile });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { updateProfile };
