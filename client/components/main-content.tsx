"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, MessageSquare, Loader2, Send, Sparkles, Zap, Brain } from "lucide-react"
import type { Note } from "@/types/note"

interface MainContentProps {
  activeNote: Note | null
  onAddNote: (note: Note) => void
  onSetActiveNote?: (note: Note | null) => void
  onSetNotes?: (notes: Note[]) => void
}

export function MainContent({ activeNote, onAddNote, onSetActiveNote, onSetNotes }: MainContentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isAnswering, setIsAnswering] = useState(false)
  const [question, setQuestion] = useState("")
  const [currentSummary, setCurrentSummary] = useState("")
  const [currentQA, setCurrentQA] = useState<Array<{ question: string; answer: string }>>([])
  const [manualText, setManualText] = useState("")
  const [isProcessingText, setIsProcessingText] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

 const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (!file || file.type !== "application/pdf") return alert("Please upload a PDF")

  setIsUploading(true)
  setIsSummarizing(true)

  try {
    const formData = new FormData()
    formData.append("file", file) // ✅ corrected field name

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-pdf`, {
      method: "POST",
      body: formData,
    })

    const result = await res.json()

    if (!res.ok) throw new Error(result.error || "Failed to summarize PDF")

    const newNote: Note = {
      id: "",
      title: file.name.replace(".pdf", ""),
      summary: result.summary,
      content: "", // optional: leave blank since we didn’t return raw content
      questions: [],
      createdAt: new Date().toISOString(),
    }

    setCurrentSummary(result.summary)
    setCurrentQA([])
    onAddNote(newNote)
  } catch (error) {
    console.error("Error analyzing PDF:", error)
    alert("Failed to process the PDF. Try again later.")
  } finally {
    setIsUploading(false)
    setIsSummarizing(false)
  }
}

  const handleAskQuestion = async () => {
    if (!question.trim() || !activeNote) return

    setIsAnswering(true)

    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, content: activeNote.content }),
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

  const handleTextSummarization = async () => {
    if (!manualText.trim()) return

    setIsProcessingText(true)

    try {
      const res = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: manualText }),
      })

      const result = await res.json()

      const newNote: Note = {
        id: "",
        title: result.title || "Manual Note",
        summary: result.summary,
        content: manualText,
        questions: [],
        createdAt: new Date().toISOString(),
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

  const handleGenerateQuestions = async () => {
    if (!activeNote) return

    setLoading(true)

    const res = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: activeNote.content || activeNote.summary }),
    })

    const data = await res.json()
    setGeneratedQuestions(data.questions)
    setLoading(false)
  }

  // Add this useEffect to clear generated questions and reset pagination when activeNote changes
  useEffect(() => {
    setGeneratedQuestions("")
    setCurrentQA([])
    setCurrentPage(1) // Reset pagination to page 1
  }, [activeNote?.id])

  return (
    <main className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl p-4 flex items-center gap-4 shadow-2xl relative z-10">
        <SidebarTrigger className="text-white hover:bg-white/10 transition-all duration-300" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
          {activeNote ? activeNote.title : "✨ AI Note Taking Studio"}
        </h2>
      </header>

      <div className="flex-1 p-6 space-y-8 relative z-10">
        {!activeNote ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* PDF Upload Section */}
            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-purple-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold animate-fade-in">
                  <Upload className="h-8 w-8 animate-bounce" />
                Summarize PDF with AI
                  <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 relative z-10">
                <div className="border-2 border-dashed border-cyan-400/50 rounded-xl p-12 text-center bg-black/20 backdrop-blur-sm hover:bg-black/30 hover:border-cyan-400 transition-all duration-300 group-hover:scale-105">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
                    {isUploading ? (
                      <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
                        <div className="absolute inset-0 h-12 w-12 border-4 border-purple-500/30 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
                        <div className="absolute -inset-2 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <span className="text-white/90 text-lg font-medium">
                      {isUploading ? "🚀 Processing PDF..." : "📄 Click to upload PDF or drag and drop"}
                    </span>
                  </label>
                </div>
                {isSummarizing && (
                  <div className="text-center text-cyan-300 animate-pulse">
                    <div className="flex items-center justify-center gap-2">
                      <Brain className="h-5 w-5 animate-spin" />
                      <span className="text-lg">🧠 AI is analyzing your document...</span>
                      <Zap className="h-5 w-5 animate-bounce text-yellow-400" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Text Input Section */}
            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-emerald-900/80 to-teal-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold animate-fade-in">
                  <MessageSquare className="h-8 w-8 animate-pulse" />
                 Write Note for AI Summary
                  <Sparkles className="h-6 w-6 animate-spin text-yellow-300" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8 relative z-10">
                <textarea
                  placeholder="✍️ Write your notes, thoughts, or any content you'd like to summarize..."
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  disabled={isProcessingText}
                  className="w-full h-48 p-6 rounded-xl border-2 border-teal-400/50 bg-black/20 backdrop-blur-sm text-white placeholder-white/70 resize-none focus:ring-4 focus:ring-teal-400/50 focus:border-teal-400 focus:outline-none transition-all duration-300 hover:bg-black/30"
                />
                <Button
                  onClick={handleTextSummarization}
                  disabled={!manualText.trim() || isProcessingText}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 font-bold py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isProcessingText ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />🚀 Processing Notes...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-3 animate-pulse" />✨ Summarize Notes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Summary Section with Pagination */}
            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-orange-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold animate-fade-in">
                  <FileText className="h-7 w-7 animate-pulse" />📋 Document Summary
                  <Sparkles className="h-5 w-5 animate-spin text-yellow-300" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative z-10">
                <div className="text-white leading-relaxed space-y-6 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  {(() => {
                    const summaryText = activeNote.summary || currentSummary
                    const paragraphs = summaryText.split("\n\n")
                    const itemsPerPage = 3
                    const totalPages = Math.ceil(paragraphs.length / itemsPerPage)

                    const startIndex = (currentPage - 1) * itemsPerPage
                    const endIndex = startIndex + itemsPerPage
                    const currentParagraphs = paragraphs.slice(startIndex, endIndex)

                    return (
                      <>
                        <div className="min-h-[200px] animate-fade-in">
                          {currentParagraphs.map((para, idx) => {
                            const isHeading = /^\d+\.\s/.test(para.trim())
                            if (isHeading) {
                              const [heading, ...rest] = para.trim().split("\n")
                              return (
                                <div
                                  key={startIndex + idx}
                                  className="animate-slide-up"
                                  style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                  <p className="font-bold underline text-xl mb-2 text-orange-300">{heading}</p>
                                  {rest.length > 0 && <p className="text-white/90">{rest.join("\n")}</p>}
                                </div>
                              )
                            }
                            return (
                              <p
                                key={startIndex + idx}
                                className="text-white/90 animate-slide-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                              >
                                {para}
                              </p>
                            )
                          })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-6 border-t border-white/20">
                            <Button
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 disabled:opacity-50 transition-all duration-300 hover:scale-105 flex-shrink-0"
                              size="sm"
                            >
                              ← Previous
                            </Button>

                            <div className="flex items-center gap-3 flex-1 justify-center">
                              <span className="text-sm text-white/80 font-medium whitespace-nowrap">
                                Page {currentPage} of {totalPages}
                              </span>
                              <div className="flex gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                  const page = i + 1
                                  if (totalPages <= 5) return page
                                  if (currentPage <= 3) return page
                                  if (currentPage >= totalPages - 2) return totalPages - 4 + i
                                  return currentPage - 2 + i
                                }).map((page) => (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 hover:scale-110 ${
                                      currentPage === page
                                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                    }`}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <Button
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 disabled:opacity-50 transition-all duration-300 hover:scale-105 flex-shrink-0"
                              size="sm"
                            >
                              Next →
                            </Button>
                          </div>
                        )}
                      </>
                    )
                  })()}

                  <Button
                    className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
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

            {/* Q&A Section - More Compact */}
            <div className="max-h-[450px]">
              <Card className="group border-0 shadow-2xl bg-gradient-to-br from-cyan-900/80 to-blue-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-cyan-500/25 h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white relative z-10">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold animate-fade-in">
                    <MessageSquare className="h-5 w-5 animate-pulse" />💬 Ask Questions
                    <Brain className="h-4 w-4 animate-bounce text-yellow-300" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 relative z-10">
                  <div className="flex gap-2">
                    <Input
                      placeholder="🤔 Ask about the document..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                      disabled={isAnswering}
                      className="bg-black/20 backdrop-blur-sm border-2 border-cyan-400/50 text-white placeholder-white/70 focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-300 text-sm"
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={!question.trim() || isAnswering}
                      size="sm"
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg px-3"
                    >
                      {isAnswering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {currentQA.map((qa, index) => (
                      <div
                        key={index}
                        className="space-y-2 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
                          <p className="text-xs font-semibold text-cyan-300">❓ {qa.question}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 p-2 rounded-lg hover:scale-105 transition-transform duration-300">
                          <p className="text-xs text-white/90 whitespace-pre-line">💡 {qa.answer}</p>
                        </div>
                      </div>
                    ))}

                    {/* Generated Questions Section - More Compact */}
                    {generatedQuestions && (
                      <div className="border-t border-white/20 pt-3 mt-3">
                        <h4 className="text-xs font-bold text-yellow-300 mb-2 flex items-center gap-1">
                          <Brain className="h-3 w-3" />🤖 AI Generated Questions
                        </h4>
                        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-400/30 p-3 rounded-lg">
                          <p className="text-xs text-white/90 whitespace-pre-line">{generatedQuestions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        {activeNote && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-violet-900/80 to-purple-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-violet-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="pt-6 relative z-10">
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
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 border-0 font-bold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50"
                    disabled={isUploading}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-3 animate-spin" />🚀 Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-3 animate-bounce" />📄 Upload New PDF
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-2xl bg-gradient-to-br from-rose-900/80 to-pink-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-rose-500/25 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="pt-6 relative z-10">
                <Button
                  onClick={() => {
                    setManualText("")
                    setCurrentSummary("")
                    setCurrentQA([])
                    if (onSetActiveNote) {
                      onSetActiveNote(null)
                    }
                  }}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500 font-bold py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <MessageSquare className="h-5 w-5 mr-3 animate-pulse" />
                  ✍️ Create New Manual Note
                </Button>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Card className="group border-0 shadow-2xl bg-gradient-to-br from-amber-900/80 to-orange-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 hover:shadow-amber-500/25 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="pt-6 relative z-10">
                  <Button
                    onClick={handleGenerateQuestions}
                    disabled={!activeNote || loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 font-bold py-4 text-xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-6 w-6 mr-3" />🧠 Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-6 w-6 mr-3 animate-pulse" />✨ Generate Questions from Note
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </main>
  )
}
