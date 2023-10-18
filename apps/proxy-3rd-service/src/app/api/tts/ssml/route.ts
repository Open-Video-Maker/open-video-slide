import { TTSService } from "@/services/tts";

import { generate, SSMLOptions } from "./generate-ms-ssml";

export async function POST(request: Request) {
  const { text, lang, voiceName, voiceStyle, voiceSpeed, voicePitch } =
    (await request.json()) as SSMLOptions;

  const ssml = generate({
    text,
    lang,
    voiceName,
    voiceStyle,
    voiceSpeed,
    voicePitch,
  });

  const tts = new TTSService({ language: lang, voiceName });
  const audio = await tts.speakSSMLAsync(ssml);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
