import { TTSService } from "tts";

import { generate } from "./generate-ms-ssml";

const subscriptionKey = process.env.TTS_AZURE_API_KEY!;
const serviceRegion = process.env.TTS_AZURE_REGION!;

export async function POST(request: Request) {
  const { text, language, voiceName } = await request.json();

  const ssml = generate({ text });
  const tts = new TTSService({ language, voiceName, subscriptionKey, serviceRegion });
  const audio = await tts.speakSSMLAsync(ssml);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
