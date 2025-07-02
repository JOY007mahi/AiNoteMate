const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  questions: [
    {
      question: String,
      answer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
