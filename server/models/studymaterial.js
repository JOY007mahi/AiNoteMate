const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalFilename: { type: String, required: true },
  filename: { type: String }, // optional or used for display
  fileType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  summary: { type: String, required: true },
  dateUploaded: { type: String, required: true },
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
