import { createHash } from "node:crypto";

import { TTSService } from "@/provider/tts";

import { putObject } from "../../_rpc/r2";
import { generate, SSMLOptions } from "./generate-ms-ssml";

export async function POST(request: Request) {
  const { text, lang, voiceName, voiceStyle, voiceSpeed, voicePitch } = (
    await request.json()
  ).body as SSMLOptions;
  const ssml = generate({
    text,
    lang,
    voiceName,
    voiceStyle,
    voiceSpeed,
    voicePitch,
  });

  try {
    const tts = new TTSService({ language: lang, voiceName });
    const { audioData: audio, audioDuration } = await tts.speakSSMLAsync(ssml);

    const hasher = createHash("sha256");
    hasher.update(text);
    const key = hasher.digest("hex");

    await putObject({
      Key: key,
      Body: Buffer.from(audio),
      ContentType: "audio/wav",
    });

    return new Response(JSON.stringify({ key, audioDuration }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response("tts/r2 error", { status: 500 });
  }
}
