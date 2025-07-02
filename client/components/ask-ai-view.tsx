"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircleQuestion,
  Send,
  Loader2,
  Brain,
  BookOpen,
  Calculator,
  Code,
  Globe,
  Lightbulb,
  Sparkles,
  Clock,
  User,
  Bot,
} from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: string
}

export function AskAIView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI study assistant. I can help you with explanations, problem-solving, research, coding, and more. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: "general", name: "General", icon: Lightbulb, color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "math", name: "Mathematics", icon: Calculator, color: "bg-green-100 text-green-700 border-green-200" },
    { id: "science", name: "Science", icon: BookOpen, color: "bg-purple-100 text-purple-700 border-purple-200" },
    { id: "coding", name: "Programming", icon: Code, color: "bg-orange-100 text-orange-700 border-orange-200" },
    { id: "research", name: "Research", icon: Globe, color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  ]

  const quickPrompts = [
    "Explain quantum physics in simple terms",
    "Help me solve this calculus problem",
    "What's the difference between React and Vue?",
    "Summarize the causes of World War I",
    "How does machine learning work?",
    "Explain photosynthesis step by step",
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      category: selectedCategory || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputMessage, selectedCategory),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (question: string, category: string | null) => {
    const responses = {
      math: `🧮 **Mathematical Solution**\n\nLet me break this down step by step:\n\n1. **Understanding the problem**: ${question}\n2. **Approach**: We'll use fundamental principles...\n3. **Solution**: Here's how to solve it...\n\n💡 **Key insight**: Remember that mathematics is about patterns and logical reasoning.`,
      science: `🔬 **Scientific Explanation**\n\n**Concept**: ${question}\n\n**Background**: This relates to fundamental scientific principles...\n**Mechanism**: Here's how it works...\n**Applications**: You can see this in...\n\n🌟 **Fun fact**: Did you know that...`,
      coding: `💻 **Programming Help**\n\n**Question**: ${question}\n\n**Solution approach**:\n\`\`\`javascript\n// Here's a clean solution\nfunction example() {\n  // Implementation details\n}\n\`\`\`\n\n**Best practices**: Remember to...\n**Further reading**: Check out...`,
      research: `📚 **Research Insights**\n\n**Topic**: ${question}\n\n**Key points**:\n• Main concept 1\n• Important detail 2\n• Critical insight 3\n\n**Sources to explore**: Academic papers, reputable websites...\n**Next steps**: Consider researching...`,
      general: `🤔 **Thoughtful Response**\n\n**Your question**: ${question}\n\n**Explanation**: Let me help you understand this...\n\n**Key takeaways**:\n• Important point 1\n• Essential concept 2\n• Practical application 3\n\n💭 **Think about**: How does this connect to what you already know?`,
    }

    return responses[category as keyof typeof responses] || responses.general
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <MessageCircleQuestion className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ask AI</h1>
              <p className="text-white/90">Your intelligent study companion</p>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-3xl">
            Get instant help with any topic. Ask questions, solve problems, explore concepts, and deepen your
            understanding with AI-powered assistance.
          </p>
        </div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Prompts */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full text-left text-sm h-auto p-3 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  <Sparkles className="h-3 w-3 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="truncate">{prompt}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="border-0 bg-white/80 backdrop-blur-sm h-[600px] flex flex-col">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-rose-600" />
                  AI Assistant
                </CardTitle>
                {selectedCategory && (
                  <Badge className={categories.find((c) => c.id === selectedCategory)?.color}>
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </Badge>
                )}
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : ""}`}>
                    <div
                      className={`rounded-2xl p-4 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans leading-relaxed">{message.content}</pre>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 order-3">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="flex-1 bg-gray-50 border-gray-200 focus:border-rose-300 focus:ring-rose-200"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
