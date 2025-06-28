// /types/note.ts
export interface Note {
  id: string
  title: string
  summary: string
  content: string
  questions: Array<{ question: string; answer: string }>
  createdAt: string
}
