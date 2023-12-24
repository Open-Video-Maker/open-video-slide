import { createHash } from "node:crypto";

import { TTSService } from "@/provider/tts";

import { putObject } from "../../_rpc/r2";
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

  const hasher = createHash("sha256");
  hasher.update(text);
  const key = hasher.digest("hex");

  putObject({ Key: key, Body: Buffer.from(audio), ContentType: "audio/wav" });

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
