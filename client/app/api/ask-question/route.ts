import { generateText } from "ai";
import { openai } from "@/lib/openrouter";

export async function POST(request: Request) {
  try {
    const { question, content } = await request.json();

    if (!question || !content) {
      return new Response("Question and content are required", { status: 400 });
    }

    const result = await generateText({
      model: openai.chat("mistralai/mistral-7b-instruct"),
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that answers questions using only the provided document content. Respond with JSON:
{
  "answer": "...",
  "confidence": "high" | "medium" | "low"
}`,
        },
        {
          role: "user",
          content: `Document content:\n${content}\n\nQuestion: ${question}`,
        },
      ],
    });

    try {
      const parsed = JSON.parse(result.text);
      return Response.json(parsed);
    } catch (err) {
      console.error("Parsing error:", result.text);
      return new Response("Model did not return valid JSON", { status: 500 });
    }
  } catch (err) {
    console.error("Error answering question:", err);
    return new Response("Failed to answer question", { status: 500 });
  }
}
