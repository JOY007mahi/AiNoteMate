import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/TxGEqnHWrfWFTfGW9XjX", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1", // you can try multilingual too
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      console.error("ElevenLabs Error:", await response.text())
      return new NextResponse("Failed to generate audio", { status: 500 })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Accept-Ranges": "bytes",
      },
    })
  } catch (err) {
    console.error("TTS Route Error:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
