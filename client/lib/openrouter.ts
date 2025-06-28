// lib/openrouter.ts
import { createOpenAI } from "@ai-sdk/openai";

// ✅ You MUST export this correctly
const openai = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!, // or hardcoded for testing
});

export { openai }; // ✅ Make sure you're exporting it like this
