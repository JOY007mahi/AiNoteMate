import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { input, mode } = await req.json()

    let prompt = ""

    // ✅ Dynamically create prompt based on mode
    if (mode === "concept") {
      prompt = `
You are an expert teacher. Your task is to reverse-engineer the following concept or conclusion into its foundational understanding.

Steps:
1. Show the final concept or conclusion.
2. Work backward to the intermediate idea(s).
3. Break it down into the most basic, foundational knowledge.

Concept to reverse:
"${input}"
      `.trim()
    } else if (mode === "question") {
      prompt = `
You are a question generation assistant. Based on the following answer or explanation, generate 5 thoughtful and challenging questions.

Answer:
"${input}"

Make sure the questions are:
- Diverse (why, how, what-if, etc.)
- Insightful
- Designed to promote deep thinking
      `.trim()
    } else if (mode === "explanation") {
      prompt = `
You are a helpful tutor. Your task is to break down the following complex explanation into 3 simplified parts:
1. A high-level overview in layman's terms.
2. Key components or concepts involved.
3. A simple analogy or real-world example.

Explanation to simplify:
"${input}"
      `.trim()
    } else {
      return NextResponse.json({ reply: "Invalid mode selected." }, { status: 400 })
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a helpful academic assistant." },
          { role: "user", content: prompt },
        ],
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("OpenRouter error:", errorText)
      return NextResponse.json({ reply: "Failed to generate response from AI." }, { status: 500 })
    }

    const data = await res.json()

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "⚠️ AI did not return a response.",
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ reply: "Internal server error." }, { status: 500 })
  }
}
