import axios from "axios";

const API_BASE = "http://localhost:5000"; // Change this if hosted elsewhere

// Define the types of responses your backend returns
interface SummarizeResponse {
  summary: string;
}

interface AskResponse {
  answer: string;
}

interface UploadPDFResponse {
  summary: string;
  content: string;
  title?: string;
}

export async function summarizeNotes(notes: string): Promise<string> {
  const res = await axios.post<SummarizeResponse>(`${API_BASE}/summarize`, { notes });
  return res.data.summary;
}

export async function askAI(notes: string, question: string): Promise<string> {
  const res = await axios.post<AskResponse>(`${API_BASE}/ask`, { notes, question });
  return res.data.answer;
}

export async function uploadPDF(file: File): Promise<UploadPDFResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post<UploadPDFResponse>(`${API_BASE}/upload-pdf`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
