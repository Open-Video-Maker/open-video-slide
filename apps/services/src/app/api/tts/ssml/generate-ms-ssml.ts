import { Document, ServiceProvider } from "ssml-document";

export type SSMLOptions = {
  text: string;
  lang?: string;
  voiceName?: string;
  voiceStyle?: string;
  voiceSpeed?: number;
  voicePitch?: string;
};
export function generate({
  text,
  lang,
  voiceName,
  voiceStyle,
  voiceSpeed,
  voicePitch,
}: SSMLOptions) {
  const doc = new Document();
  const ssml = doc
    .voice(voiceName ?? "zh-CN-XiaoxiaoNeural")
    .prosody({
      rate: (voiceSpeed ?? 50) / 50,
      pitch: voicePitch?.toLowerCase() ?? "default",
    })
    .expressAs({ style: voiceStyle?.toLowerCase() ?? "gentle" })
    .say(text)
    .up()
    .up()
    .render({
      pretty: true,
      provider: ServiceProvider.Microsoft,
    });

  const wrap = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${lang}">{children}</speak>`;
  return wrap.replace("{children}", ssml);
}
