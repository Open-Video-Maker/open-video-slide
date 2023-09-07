import { TTSService } from "../../../services/tts";

export async function POST(request: Request) {
  const { text } = await request.json();

  const tts = new TTSService();
  const audio = await tts.speakTextAsync(text);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
