🧠 AI NoteMate

**AI NoteMate** is an intelligent notepad web app for students to **upload, summarize, and study from PDFs or images** using AI. It supports OCR for handwritten/printed notes and integrates reverse learning (question generation) and voice features using ElevenLabs.

---
✨ Features

- 📤 Upload PDFs and Images
- 🧠 AI-Powered Summarization (via OpenRouter)
- 🔍 OCR for handwritten/printed images (via Tesseract.js)
- 🔊 Voice Playback of summaries (via ElevenLabs)
- 📚 StudyVault to organize uploaded materials
- 🔁 Reverse Learning Mode: AI-generated questions
- ⚡ Fast, modern UI with search, preview, and download options

---

## 🔗 Live Demo

| Component  | URL                                                        |
|------------|------------------------------------------------------------|
| Frontend   | [https://ainotemate.vercel.app](https://ainotemate.vercel.app) |
| Backend API| Render |

---
 
⚙️ Tech Stack

 Frontend
- **React 19**, **Next.js 15**
- **TailwindCSS**, **ShadCN**, **Radix UI**
- **Axios**, **Zod**, **React Hook Form**

### Backend
- **Node.js**, **Express.js**
- **MongoDB (Mongoose)**
- **OpenRouter API**
- **ElevenLabs API**
- **Tesseract.js** for OCR

---

## 🧱 Project Structure


ainotemate/
├── client/     # Frontend - Next.js App
└── server/     # Backend - Express.js API
