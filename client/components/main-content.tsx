"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, MessageSquare, Loader2, Send } from "lucide-react"
import type { Note } from "@/types/note"


interface MainContentProps {
  activeNote: Note | null
  onAddNote: (note: Note) => void
  onSetActiveNote: (note: Note | null) => void
  onSetNotes: (notes: Note[]) => void
}

export function MainContent({ activeNote, onAddNote, onSetActiveNote, onSetNotes }: MainContentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isAnswering, setIsAnswering] = useState(false)
  const [isProcessingText, setIsProcessingText] = useState(false)
  const [question, setQuestion] = useState("")
  const [currentSummary, setCurrentSummary] = useState("")
  const [currentQA, setCurrentQA] = useState<Array<{ question: string; answer: string }>>([])
  const [manualText, setManualText] = useState("")

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`)
        const data = await res.json()

        const mappedNotes = data.map((n: any) => ({
          ...n,
          id: n._id || n.id || Date.now().toString()
        }))

        onSetNotes(mappedNotes)
      } catch (error) {
        console.error("Failed to load notes from MongoDB", error)
      }
    }

    fetchNotes()
  }, [onSetNotes])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || file.type !== "application/pdf") return alert("Please upload a PDF")

    setIsUploading(true)
    setIsSummarizing(true)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-pdf`, {
        method: "POST",
        body: formData
      })

      const result = await res.json()

      const newNote: Note = {
        id: "", // let backend generate ID; HomePage will map it later
        title: file.name.replace(".pdf", ""),
        summary: result.summary,
        content: result.content,
        questions: [],
        createdAt: new Date().toISOString()
      }

      setCurrentSummary(result.summary)
      setCurrentQA([])
      onAddNote(newNote) // ✅ this will post to backend
    } catch (error) {
      console.error("Error analyzing PDF:", error)
    } finally {
      setIsUploading(false)
      setIsSummarizing(false)
    }
  }

  const handleTextSummarization = async () => {
    if (!manualText.trim()) return

    setIsProcessingText(true)

    try {
      const res = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: manualText })
      })

      const result = await res.json()

      const newNote: Note = {
        id: "", // let HomePage assign _id to id
        title: result.title || "Manual Note",
        summary: result.summary,
        content: manualText,
        questions: [],
        createdAt: new Date().toISOString()
      }

      setCurrentSummary(result.summary)
      setCurrentQA([])
      setManualText("")
      onAddNote(newNote)
    } catch (error) {
      console.error("Text summarization failed", error)
    } finally {
      setIsProcessingText(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!question.trim() || !activeNote) return

    setIsAnswering(true)
    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, content: activeNote.content })
      })

      const result = await res.json()
      const newQA = { question, answer: result.answer }
      setCurrentQA((prev) => [...prev, newQA])
      setQuestion("")
    } catch (error) {
      console.error("Question answering failed:", error)
    } finally {
      setIsAnswering(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
   <header className="border-b bg-white/80 backdrop-blur-sm p-4 flex items-center gap-4 shadow-sm">
        <SidebarTrigger />
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {activeNote ? activeNote.title : "AI Note Taking"}
        </h2>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {!activeNote ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* PDF Upload Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Upload className="h-7 w-7" />
                  Upload PDF Document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center bg-white/10 backdrop-blur-sm">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    ) : (
                      <FileText className="h-8 w-8 text-white" />
                    )}
                    <span className="text-white/90">
                      {isUploading ? "Processing PDF..." : "Click to upload PDF or drag and drop"}
                    </span>
                  </label>
                </div>
                {isSummarizing && (
                  <div className="text-center text-white/90">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Analyzing document and generating summary...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Text Input Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <MessageSquare className="h-7 w-7" />
                  Enter Note Manually
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  placeholder="Write your notes, thoughts, or any content you'd like to summarize..."
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  disabled={isProcessingText}
                  className="w-full h-40 p-4 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 resize-none focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
                <Button
                  onClick={handleTextSummarization}
                  disabled={!manualText.trim() || isProcessingText}
                  className="w-full bg-white text-emerald-600 hover:bg-white/90 font-semibold py-3"
                >
                  {isProcessingText ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Notes...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Summarize Notes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-400 to-pink-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-6 w-6" />
                  Document Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white/95 leading-relaxed space-y-4">
                  {(activeNote.summary || currentSummary)
                    .split("\n\n")
                    .map((para, idx) => {
                      const isHeading = /^\d+\.\s/.test(para.trim())
                      if (isHeading) {
                        const [heading, ...rest] = para.trim().split("\n")
                        return (
                          <div key={idx}>
                            <p className="font-bold underline text-lg mb-1">{heading}</p>
                            {rest.length > 0 && <p>{rest.join("\n")}</p>}
                          </div>
                        )
                      }
                      return <p key={idx}>{para}</p>
                    })}
         
<Button
  className="mt-2"
  onClick={async () => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: activeNote?.summary || "No summary available to read" }),
      })

      if (!res.ok) {
        alert("Failed to generate audio")
        return
      }

      const arrayBuffer = await res.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)

      const audio = new Audio(url)
      audio.play()
    } catch (err) {
      console.error("TTS Playback Error", err)
    }
  }}
>
  🔊 Listen to Summary
</Button>

                </div>
              </CardContent>
            </Card>

            {/* Q&A Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-6 w-6" />
                  Ask Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question about the document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                    disabled={isAnswering}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder-white/70 focus:ring-white/50"
                  />
                  <Button
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || isAnswering}
                    size="icon"
                    className="bg-white text-cyan-600 hover:bg-white/90"
                  >
                    {isAnswering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {currentQA.map((qa, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-sm font-medium text-white/95">Q: {qa.question}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                        <p className="text-sm text-white/95 whitespace-pre-line">A: {qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Buttons */}
        {activeNote && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-violet-500 to-purple-600">
              <CardContent className="pt-6">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="new-pdf-upload"
                />
                <label htmlFor="new-pdf-upload">
                  <Button
                    variant="outline"
                    className="w-full bg-white text-violet-600 hover:bg-white/90 border-0 font-semibold"
                    disabled={isUploading}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New PDF
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-rose-500 to-pink-600">
              <CardContent className="pt-6">
                <Button
                  onClick={() => {
                    setManualText("")
                    setCurrentSummary("")
                    setCurrentQA([])
                    onSetActiveNote(null)
                  }}
                  className="w-full bg-white text-rose-600 hover:bg-white/90 font-semibold"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create New Manual Note
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
