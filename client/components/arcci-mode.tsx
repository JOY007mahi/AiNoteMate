"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

export function ArcCIMode() {
  const [currentMode, setCurrentMode] = useState<"concept" | "question" | "explanation">("concept")
  const [userInput, setUserInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [responses, setResponses] = useState<Array<{ type: string; content: string; timestamp: Date }>>([])

  const modes = [
    {
      id: "concept",
      title: "Concept Reversal",
      description: "Start with conclusions, work backwards to fundamentals",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: "question",
      title: "Question Genesis",
      description: "Generate questions from answers you provide",
      icon: MessageSquare,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "explanation",
      title: "Explanation Deconstruction",
      description: "Break down complex explanations into simple parts",
      icon: Lightbulb,
      gradient: "from-amber-500 to-orange-500",
    },
  ]

  const handleStartSession = () => {
    setSessionActive(true)
    setResponses([])
  }

  const handleProcessInput = async () => {
    if (!userInput.trim()) return

    setIsProcessing(true)

    try {
      const res = await fetch("/api/arcci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: currentMode, input: userInput }),
      })

      const data = await res.json()

      const newResponse = {
        type: currentMode,
        content: data.reply,
        timestamp: new Date(),
      }

      setResponses((prev) => [...prev, newResponse])
      setUserInput("")
    } catch (err) {
      console.error("AI processing failed", err)
      alert("Something went wrong while processing your input.")
    }

    setIsProcessing(false)
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ArcCI Mode</h1>
              <p className="text-white/90">Reverse Learning • Question Genesis • Deep Understanding</p>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-3xl">
            Traditional learning goes from simple to complex. ArcCI Mode reverses this - start with complex concepts,
            conclusions, or answers, then work backwards to build deeper understanding.
          </p>
        </div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Mode Selection */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Learning Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                currentMode === mode.id
                  ? "border-purple-300 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white/80 hover:border-purple-200"
              }`}
              onClick={() => setCurrentMode(mode.id as any)}
            >
              <CardContent className="p-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center shadow-lg mb-4`}
                >
                  <mode.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{mode.title}</h3>
                <p className="text-sm text-gray-600">{mode.description}</p>
                {currentMode === mode.id && (
                  <Badge className="mt-3 bg-purple-100 text-purple-700 border-purple-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Session Controls */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Learning Session
            </div>
            <div className="flex items-center gap-2">
              {!sessionActive ? (
                <Button
                  onClick={handleStartSession}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setSessionActive(false)}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResponses([])
                      setUserInput("")
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessionActive && (
            <>
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {currentMode === "concept" && "Enter a complex concept or conclusion:"}
                    {currentMode === "question" && "Provide an answer or statement:"}
                    {currentMode === "explanation" && "Paste a complex explanation:"}
                  </label>
                  <Textarea
                    placeholder={
                      currentMode === "concept"
                        ? "e.g., 'Machine learning algorithms can predict human behavior'"
                        : currentMode === "question"
                        ? "e.g., 'Photosynthesis converts sunlight into chemical energy'"
                        : "e.g., 'Quantum entanglement occurs when particles become interconnected...'"
                    }
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  />
                </div>
                <Button
                  onClick={handleProcessInput}
                  disabled={!userInput.trim() || isProcessing}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Process with ArcCI
                    </>
                  )}
                </Button>
              </div>

              {/* Responses */}
              {responses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Learning Insights
                  </h3>
                  {responses.map((response, index) => (
                    <Card key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {modes.find((m) => m.id === response.type)?.title}
                          </Badge>
                          <span className="text-xs text-gray-500">{response.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                            {response.content}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {!sessionActive && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Reverse Your Learning?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start a session to experience how working backwards from complex concepts can deepen your understanding.
              </p>
              <Button
                onClick={handleStartSession}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Begin ArcCI Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}