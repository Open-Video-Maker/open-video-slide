"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const generate = async (text: string) => {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const buffer = await res.arrayBuffer();

    // const audioContext = new AudioContext();
    // audioContext.decodeAudioData(buffer, (audioBuffer) => {
    //   const source = audioContext.createBufferSource();
    //   source.buffer = audioBuffer;
    //   source.connect(audioContext.destination);
    //   source.start();
    // });

    const url = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));

    setResult(url);
  };

  return (
    <main className="flex flex-col items-center py-8 w-1/2 m-auto">
      <h1 className="text-2xl my-2 font-bold">TTS playgroud</h1>
      <div className="w-full">
        <section className="flex justify-center my-4">
          <textarea
            className="w-2/3 min-h-full h-80 p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </section>
        <section className="flex justify-center my-4"></section>
        <section className="flex justify-center my-4">
          <button
            className="border p-2 bg-slate-50"
            onClick={() => generate(text)}
          >
            Generate
          </button>
        </section>
        <section className="flex justify-center my-4">
          <div>
            <h2>Result</h2>
            <div>{result && <audio controls src={result}></audio>}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
