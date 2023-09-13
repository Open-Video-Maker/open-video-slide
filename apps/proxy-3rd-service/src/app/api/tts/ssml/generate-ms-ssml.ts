import { Document, ServiceProvider } from "ssml-document";
// import { esMain } from "@/utils";

type SSMLOptions = {
  text: string;
};
export function generate({ text }: SSMLOptions) {
  const doc = new Document();
  const ssml = doc
    .voice("zh-CN-XiaoxiaoNeural")
    .prosody({ rate: 1.5, pitch: 1.1 })
    .say(text)
    .up()
    .up()
    .render({
      pretty: true,
      provider: ServiceProvider.Microsoft,
    });
  return ssml;
}

// if (esMain(import.meta.url)) {
//   const ssml = generate({ text: "你好" });
//   console.log(ssml);
// }
