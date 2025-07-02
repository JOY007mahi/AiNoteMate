"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, ClipboardCopy } from "lucide-react"

interface FlashcardProps {
  questions: string[]
}

export default function FlashcardView({ questions }: FlashcardProps) {
  const [index, setIndex] = useState(0)

  const current = questions[index]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(current)
      alert("📋 Question copied!")
    } catch (err) {
      console.error("Failed to copy", err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <Card className="w-full max-w-xl min-h-[180px] bg-white shadow-md border-indigo-200 text-indigo-800 transition-all duration-300">
        <CardContent className="p-6 text-lg font-medium text-center whitespace-pre-line">
          {current || "No question"}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Prev
        </Button>

        <Button
          variant="outline"
          onClick={copyToClipboard}
          title="Copy question"
        >
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy
        </Button>

        <Button
          variant="outline"
          disabled={index === questions.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        Flashcard {index + 1} of {questions.length}
      </div>
    </div>
  )
}
