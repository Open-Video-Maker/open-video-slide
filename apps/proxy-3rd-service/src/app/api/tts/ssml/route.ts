import { TTSService } from "@/services/tts";

import { generate } from "./generate-ms-ssml";

export async function POST(request: Request) {
  const { text, language, voiceName } = await request.json();

  const ssml = generate({ text });
  const tts = new TTSService({ language, voiceName });
  const audio = await tts.speakSSMLAsync(ssml);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
