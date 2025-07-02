export interface Note {
  id: string
  title: string
  _id?: string
  summary: string
  content: string
  questions: Array<{ question: string; answer: string }>
  createdAt: string
}
