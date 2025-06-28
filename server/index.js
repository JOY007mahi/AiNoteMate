require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route: Summarize manual notes
app.post("/summarize", async (req, res) => {
  const { notes } = req.body;
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: `Summarize the following notes clearly in plain text:

- Use numbered sections and subpoints.
- Add line spacing between major sections.
- Break into paragraphs for readability.
- Avoid Markdown symbols like ** or ##.
- Make it well-structured for easy reading by students.

Here are the notes:

${notes}`
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to summarize notes" });
  }
});

// ✅ Route: Answer questions
app.post("/ask", async (req, res) => {
  const { notes, question } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful and smart AI assistant. When a question is asked based on the notes, respond in a readable and structured format. If it's a 'list-based' question (e.g. 'What are the main topics?'), return bulleted or numbered points, each on its own line. If it's a conceptual question, return a concise and well-structured paragraph. Do not remove or merge topic headings. Preserve proper spacing.",
          },
          {
            role: "user",
            content: `Here are the notes:\n\n${notes}\n\nNow answer this question:\n\n${question}`,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("Q&A error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

// ✅ Route: Upload and summarize PDF
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
          content: `Please summarize the following PDF content into clean, well-organized plain text.

Formatting Rules:
- Use numbered sections like 1., 2., etc.
- Each section should have a short heading/title.
- Make the heading appear on its own line (before the paragraph).
- Do NOT use markdown symbols (*, **, #, -, etc.)
- Leave a blank line after each paragraph for readability.

Example format:

1. Disk Structure  
Disk drives are organized as large one-dimensional arrays...

2. Disk Scheduling  
Various disk scheduling algorithms exist...

Here is the content:



${extractedText}`

          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary, content: extractedText });
  } catch (error) {
    console.error('PDF Upload Summarize Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to summarize uploaded PDF' });
  }
});

// ✅ Start server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
