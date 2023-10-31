import fs from "node:fs";

export async function POST(request: Request) {
  // const { text, language, voiceName } = await request.json();

  const audioPath = process.cwd() + "/public/demo.wav";

  const audio = fs.readFileSync(audioPath);

  return new Response(audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
