const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  avatarUrl: String,
  university: String,
  major: String,
  notificationPreferences: {
    studyReminders: { type: Boolean, default: true },
    aiInsights: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: false },
    newFeatures: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model("Profile", userProfileSchema);
