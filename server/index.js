require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const connectDB = require('./db');
const Note = require('./models/note');
const StudyMaterial = require('./models/studymaterial');

const app = express();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectDB();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/notes', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.post('/summarize', async (req, res) => {
  const { notes } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `Summarize the following notes clearly in plain text:

- Use numbered sections and subpoints.
- Add line spacing between major sections.
- Break into paragraphs for readability.
- Avoid Markdown symbols like ** or ##.
- Make it well-structured for easy reading by students.

Here are the notes:

${notes}`,
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
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize notes' });
  }
});

app.post('/ask', async (req, res) => {
  const { notes, question } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful and smart AI assistant. When a question is asked based on the notes, respond in a readable and structured format. If it's a 'list-based' question (e.g. 'What are the main topics?'), return bulleted or numbered points, each on its own line. If it's a conceptual question, return a concise and well-structured paragraph. Do not remove or merge topic headings. Preserve proper spacing.",
          },
          {
            role: 'user',
            content: `Here are the notes:\n\n${notes}\n\nNow answer this question:\n\n${question}`,
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

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

app.post('/upload-study-material', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fileType = file.mimetype.startsWith('image/') ? 'image' : 'pdf';
    const dateUploaded = new Date().toISOString().split('T')[0];
    const filePath = path.join(__dirname, 'uploads', file.filename);

    let extractedText = '';

    if (fileType === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else {
      const processedPath = path.join(__dirname, 'uploads', 'processed-' + file.filename);
      await sharp(filePath).grayscale().normalize().toFile(processedPath);
      const ocrResult = await Tesseract.recognize(processedPath, 'eng');
      extractedText = ocrResult.data.text || '[No text extracted]';
      fs.unlinkSync(processedPath);
    }

    const summaryResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `Summarize the following content with good formatting and clarity:\n\n${extractedText}`,
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

    const summary = summaryResponse.data.choices[0].message.content;

    const titleResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `Based on the following content, suggest a short and meaningful title (one phrase or 2-3 words) that best represents the main topic. Don't include quotation marks or numbers.\n\n${extractedText}`,
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

    const smartTitle = titleResponse.data.choices[0].message.content.trim();

       const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    const newMaterial = new StudyMaterial({
      title: smartTitle,
      originalFilename: file.originalname,
      filename: smartTitle || file.originalname, // optional, keep if you use it on frontend
      fileType,
      fileUrl,
      summary,
      dateUploaded,
    });

    await newMaterial.save();

    res.status(201).json(newMaterial);
  } catch (err) {
  console.error("❌ Upload error:", err); // <== add this line
  res.status(500).json({ error: 'Failed to process file' });
}

});

app.get('/study-materials', async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ dateUploaded: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study materials' });
  }
});

app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      res.status(500).send('File download failed');
    }
  });
});


app.delete("/study-materials/:id", async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).send("Material not found");

    if (material.fileUrl) {
      const filename = path.basename(material.fileUrl); // Get just the file name safely
      const filePath = path.join(__dirname, "uploads", filename);

      // Make sure it's a file, and not the whole uploads directory
      if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath); // Delete the file
        console.log("✅ Deleted:", filePath);
      } else {
        console.warn("⚠️ File does not exist or is not a regular file:", filePath);
      }
    }

    res.status(200).json({ message: "Material deleted" });
  } catch (err) {
    console.error("❌ Failed to delete study material:", err);
    res.status(500).send("Failed to delete material");
  }
});



app.listen(5000, () => console.log('✅ Server running on port 5000'));
