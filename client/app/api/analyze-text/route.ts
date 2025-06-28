import { generateText } from "ai";
import { openai } from "@/lib/openrouter";

export async function POST(request: Request) {
  const { text } = await request.json();

  const result = await generateText({
    model: openai.chat("mistralai/mistral-7b-instruct"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes text. Provide the following:\n1. A title (3–8 words)\n2. A summary (100–150 words)\n3. A list of 3–5 key topics\n4. Approximate word count of the original text.\n\nFormat it in JSON like this:\n{\n  \"title\": \"...\",\n  \"summary\": \"...\",\n  \"keyTopics\": [\"...\", \"...\"],\n  \"wordCount\": 123\n}",
      },
      {
        role: "user",
        content: `Text:\n\n${text}`,
      },
    ],
  });

  // 🧠 Try to safely parse the response text
  try {
    const parsed = JSON.parse(result.text);
    return Response.json(parsed);
  } catch (err) {
    console.error("Failed to parse model response:", result.text);
    return new Response("Model output was not valid JSON", { status: 500 });
  }
}
