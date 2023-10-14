"use client";
import { useRef, useState } from "react";
import { Button, Header, Slide } from "ui";
import type { SlideImageProps, SlideRef } from "ui";
import * as VTT from "vtt.js";

interface VttCue {
  startTime: number;
  endTime: number;
  text: string;
}
interface WebVTTParser {
  oncue: (cue: VttCue) => void;
  parse: (vtt: string) => void;
  flush: () => void;
}

class WebVTTInterface {
  processCues: (
    window: Window,
    cues: VTTCue[],
    overlay: HTMLElement,
  ) => HTMLElement[];
  StringDecoder: () => TextDecoder;
  convertCueToDOMTree: (cue: VTTCue) => HTMLElement;
  Parser: new (window: Window, decoder: TextDecoder) => WebVTTParser;
}

function generateWebVTT(textSegments: string[], audioDuration: number): string {
  let webVTTContent = "WEBVTT\n\n"; // WebVTT header
  // Format a timestamp in HH:MM:SS.SSS format
  const formatTimestamp = (timestamp: number): string => {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    const milliseconds = Math.round((timestamp % 1) * 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(
      3,
      "0",
    )}`;
  };

  const segmentDuration = audioDuration / textSegments.length;
  let currentTime = 0;

  for (const textSegment of textSegments) {
    const startTimestamp = formatTimestamp(currentTime);
    currentTime += segmentDuration;
    const endTimestamp = formatTimestamp(currentTime);

    webVTTContent += `${startTimestamp} --> ${endTimestamp}\n`;
    webVTTContent += `${textSegment}\n\n`;
  }

  // Save the generated WebVTT content to a file or display it on a webpage.
  return webVTTContent;
}

function parseHTMLText(input: string): { text: string; list: string[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");

  // add list number
  [...doc.body.querySelectorAll("h2")].map(
    (item: HTMLElement, index) =>
      (item.innerHTML = `${index + 1}.${item.innerHTML}`),
  );

  const list: string[] = doc.body.innerText
    .replace(/{{image}}/g, "")
    .split(" ")
    .reduce((acc: string[], v) => [...acc, ...v.split("。")], [])
    .filter(Boolean);

  const text = doc.body.innerText
    .replace(/{{image}}/g, "")
    .split(" ")
    .filter(Boolean)
    .join("\n");

  return { text, list };
}

// Example usage:
const inputHTML = `<h1>家里常见的过敏源</h1> <p>除了花粉之外,家里还可能存在其他常见的过敏源。了解这些过敏源对控制过敏反应很有帮助。</p>  <h2>宠物</h2>{{image}}   <p>猫狗的皮毛和唾液可能包含过敏原,特别是如果家里养猫。定期清洁和除尘可以减少过敏风险。</p>  <h2>尘螨</h2>{{image}} <p>尘螨及其粪便可能引起过敏。应定期清洁,更换床上用品可以杜绝尘螨。</p>   <h2>霉菌</h2>{{image}} <p>潮湿的环境有利于霉菌生长。应保持房屋通风和定期除霉来防止过敏。</p>`; // Replace with your input HTML
const { text: TEXT, list } = parseHTMLText(inputHTML);

const images: SlideImageProps[] = [
  { src: "https://swiperjs.com/demos/images/nature-1.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-2.jpg", duration: 4000 },
  { src: "https://swiperjs.com/demos/images/nature-3.jpg", duration: 4000 },
  { src: "https://swiperjs.com/demos/images/nature-4.jpg", duration: 4000 },
  { src: "https://swiperjs.com/demos/images/nature-5.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-6.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-7.jpg", duration: 1000 },
  { src: "https://swiperjs.com/demos/images/nature-8.jpg", duration: 3000 },
];

export default function Page(): JSX.Element {
  const slideRef = useRef<SlideRef>(null);
  const [curVTT, setCurVTT] = useState("");

  const startAutoplay = async (): Promise<void> => {
    const source = await getAudioSource(TEXT);
    source.start();

    if (source.buffer?.duration) {
      const { WebVTT } = VTT as unknown as { WebVTT: WebVTTInterface };
      const vtt = generateWebVTT(list, source.buffer.duration);
      const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
      const cues: VttCue[] = [];
      parser.oncue = function oncueHandler(cue) {
        cues.push(cue);
      };
      parser.parse(vtt);
      parser.flush();

      // Sort the cues by start time
      cues.sort((a, b) => a.startTime - b.startTime);

      // Display cues one by one with the correct timing
      for (const cue of cues) {
        setTimeout(() => {
          setCurVTT(cue.text);
        }, cue.startTime * 1000);
      }
    }

    // Call the startAutoplay function on the Slide component
    slideRef.current?.startAutoplay();
  };

  const getAudioSource = async (
    text: string,
  ): Promise<AudioBufferSourceNode> => {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const buffer = await res.arrayBuffer();

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    return source;
  };

  return (
    <>
      <Header text="Web" />
      <Button />
      <button
        onClick={() => {
          void startAutoplay();
        }}
        type="button"
      >
        Start Autoplay
      </button>
      <div style={{ position: "relative" }}>
        <Slide effect="fade" images={images} ref={slideRef} size={[360, 640]} />
        <div
          id="overlay"
          style={{
            position: "absolute",
            width: "360px",
            height: "640px",
            top: "50px",
            margin: "0 auto",
            left: "50%",
            marginLeft: "-180px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.33)",
              textAlign: "center",
            }}
          >
            {curVTT}
          </div>
        </div>
      </div>
    </>
  );
}
