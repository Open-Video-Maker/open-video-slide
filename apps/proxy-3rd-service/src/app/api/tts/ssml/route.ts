import { TTSService } from "@/services/tts";

import { generate, SSMLOptions } from "./generate-ms-ssml";

export async function POST(request: Request) {
  const { text, lang, voice, voiceStyle, voiceSpeed, voicePitch } =
    (await request.json()) as SSMLOptions;

  const ssml = generate({ text });
  return Response.json({ ssml });

  // const tts = new TTSService({ language, voiceName });
  // const audio = await tts.speakSSMLAsync(ssml);

  // return new Response(audio, {
  //   headers: {
  //     "Content-Type": "audio/wav",
  //   },
  // });
}
