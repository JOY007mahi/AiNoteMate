import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { text } = await req.json()

  const prompt = `
You're a teacher preparing exam questions.

From the following notes, generate **5 clear questions** students may be asked in an exam.

NOTES:
${text}

Only return questions numbered like:
1. ...
2. ...
3. ...
4. ...
5. ...
`

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
   body: JSON.stringify({
  model: "mistralai/mistral-7b-instruct"
,
 // ✅ valid OpenRouter model name
  messages: [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: prompt },
  ],
}),

  })

  const data = await response.json()

  // ✅ Add this debug log
  console.log("🔍 OpenRouter raw response:", JSON.stringify(data, null, 2))

  const generatedText = data?.choices?.[0]?.message?.content?.trim() || "No questions generated."

  return NextResponse.json({ questions: generatedText })
}
