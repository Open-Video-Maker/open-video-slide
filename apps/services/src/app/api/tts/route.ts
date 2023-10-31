import { TTSService } from "@/provider/tts";

export async function POST(request: Request) {
  const { text, language, voiceName } = await request.json();

  const tts = new TTSService({ language, voiceName });
  const audio = await tts.speakTextAsync(text);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
