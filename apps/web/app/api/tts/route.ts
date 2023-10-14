import { TTSService } from "tts";

const subscriptionKey = process.env.TTS_AZURE_API_KEY;
const serviceRegion = process.env.TTS_AZURE_REGION;

export async function POST(request: Request) {
  const { text, language, voiceName } = (await request.json()) as Record<
    string,
    string
  >;

  const tts = new TTSService({
    language,
    voiceName,
    subscriptionKey,
    serviceRegion,
  });
  const audio = await tts.speakTextAsync(text);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
