"use client";
import type { Audio, Material } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
// import { Slide } from "ui";
import type { SlideImageProps } from "ui";
// , SlideRef
// import * as VTT from "vtt.js";

// interface VttCue {
//   startTime: number;
//   endTime: number;
//   text: string;
// }
// interface WebVTTParser {
//   oncue: (cue: VttCue) => void;
//   parse: (vtt: string) => void;
//   flush: () => void;
// }

// class WebVTTInterface {
//   processCues: (
//     window: Window,
//     cues: VTTCue[],
//     overlay: HTMLElement,
//   ) => HTMLElement[];
//   StringDecoder: () => TextDecoder;
//   convertCueToDOMTree: (cue: VTTCue) => HTMLElement;
//   Parser: new (window: Window, decoder: TextDecoder) => WebVTTParser;
// }

// function generateWebVTT(textSegments: string[], audioDuration: number): string {
//   let webVTTContent = "WEBVTT\n\n"; // WebVTT header
//   // Format a timestamp in HH:MM:SS.SSS format
//   const formatTimestamp = (timestamp: number): string => {
//     const hours = Math.floor(timestamp / 3600);
//     const minutes = Math.floor((timestamp % 3600) / 60);
//     const seconds = Math.floor(timestamp % 60);
//     const milliseconds = Math.round((timestamp % 1) * 1000);

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
//       2,
//       "0",
//     )}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(
//       3,
//       "0",
//     )}`;
//   };

//   const segmentDuration = audioDuration / textSegments.length;
//   let currentTime = 0;

//   for (const textSegment of textSegments) {
//     const startTimestamp = formatTimestamp(currentTime);
//     currentTime += segmentDuration;
//     const endTimestamp = formatTimestamp(currentTime);

//     webVTTContent += `${startTimestamp} --> ${endTimestamp}\n`;
//     webVTTContent += `${textSegment}\n\n`;
//   }

//   // Save the generated WebVTT content to a file or display it on a webpage.
//   return webVTTContent;
// }

// aki todo: why after preload, the audio still refetch the audio from the server?
interface DisplayData {
  imageList: SlideImageProps[];
  contentList: string[];
}

interface CustomAudio extends Audio {
  order: number;
  audioDuration: number;
}

function getAudioUrl(key: string): string {
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- nextjs env
  return `${process.env.NEXT_PUBLIC_R2Host}/${key}`;
}
function preloadAudios(audios: CustomAudio[]): Promise<string[]> {
  const audioPromises = audios.map((audioItem) => {
    return new Promise<string>((resolve, reject) => {
      const audio = new Audio(getAudioUrl(audioItem.url));
      audio.addEventListener("loadeddata", () => {
        resolve(audioItem.url);
      });
      audio.addEventListener("error", () => {
        reject(audioItem.url);
      });
      audio.load();
    });
  });

  return Promise.all(audioPromises);
}

const UseMaterialRsp = (): {
  data?: {
    audiosData: CustomAudio[];
    imagesData: SlideImageProps[];
    contentsData: string[];
  };
  hasError: boolean;
  loading: boolean;
  fetchMaterial: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<{
    audiosData: CustomAudio[];
    imagesData: SlideImageProps[];
    contentsData: string[];
  }>();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMaterial = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { status, data: origin } = (await fetch(
        `/api/material?id=${id}`,
      ).then((res) => res.json())) as {
        status: number;
        data: {
          material: Material & {
            audios: Audio[];
          };
        };
      };
      if (status === 0) {
        const {
          imageList: imageString,
          contentList: contentString,
          audios: _audios,
        } = origin.material;
        let entireDuration = 0; // aki todo: this value is wierd, need to check
        const audiosData = _audios
          .map((audio) => {
            const audioDetail = (JSON.parse(audio.detail) || {}) as {
              order?: number;
              audioDuration?: number;
            };
            entireDuration += audioDetail.audioDuration || 0;
            return {
              ...audio,
              order: audioDetail.order || 0,
              audioDuration: audioDetail.audioDuration || 0,
            };
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        const imageList = imageString?.split(";;").filter(Boolean) || [];
        const imagesData: SlideImageProps[] = imageList.map((src) => ({
          src,
          duration: entireDuration / imageList.length,
        }));
        const contentsData = contentString.split(";;");

        setData({
          audiosData,
          imagesData,
          contentsData,
        });
      } else {
        setHasError(true);
      }
    } catch (e) {
      console.error(e);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, hasError, loading, fetchMaterial };
};

/**
 * @param id-materialId
 */
export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audiosRef = useRef<CustomAudio[]>([]);
  const { data: materialData, fetchMaterial } = UseMaterialRsp();
  const [displayData, setDisplayData] = useState<DisplayData>();
  // const [audioUrl, setAudioUrl] = useState<string>("");
  // const [audios, setAudios] = useState<CustomAudio[]>([]);
  // const slideRef = useRef<SlideRef>(null);
  // const [curVTT, setCurVTT] = useState("");
  // const [size, setSize] = useState({ width: 0, height: 0 });
  // const [ready, setReady] = useState(false);

  const playAudios = useCallback((index: number): void => {
    if (index < audiosRef.current.length && audioRef.current) {
      const url = getAudioUrl(audiosRef.current[index].url);
      audioRef.current.setAttribute("src", url);
      audioRef.current.load();
      try {
        void audioRef.current.play();
      } catch (error) {
        console.error(error);
      }
      audioRef.current.onended = () => {
        playAudios(index + 1);
      };
    }
  }, []);

  // call material api using the id params
  useEffect(() => {
    void fetchMaterial(params.id);
  }, [fetchMaterial, params.id]);

  // update the display data and start playing audio
  useEffect(() => {
    if (!materialData) return;
    const { audiosData, imagesData, contentsData } = materialData;
    audiosRef.current = audiosData;
    setDisplayData({
      imageList: imagesData,
      contentList: contentsData,
    });
    void preloadAudios(audiosData)
      .then(() => {
        if (audiosData.length) {
          playAudios(0);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [materialData, playAudios]);

  // // aki todo: use the contentList to generate the vtt file
  // const startAutoplay = useCallback((): void => {
  //   // const source = await getAudioSource(TEXT);
  //   // source.start();

  //   // if (source.buffer?.duration) {
  //   //   const { WebVTT } = VTT as unknown as { WebVTT: WebVTTInterface };
  //   //   const vtt = generateWebVTT(list, source.buffer.duration);
  //   //   const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
  //   //   const cues: VttCue[] = [];
  //   //   parser.oncue = function oncueHandler(cue) {
  //   //     cues.push(cue);
  //   //   };
  //   //   parser.parse(vtt);
  //   //   parser.flush();

  //   //   // Sort the cues by start time
  //   //   cues.sort((a, b) => a.startTime - b.startTime);

  //   //   // Display cues one by one with the correct timing
  //   //   for (const cue of cues) {
  //   //     setTimeout(() => {
  //   //       setCurVTT(cue.text);
  //   //     }, cue.startTime * 1000);
  //   //   }
  //   // }

  //   // Call the startAutoplay function on the Slide component
  //   slideRef.current?.startAutoplay();
  // }, []);

  // useEffect(() => {
  //   if (ready) {
  //     startAutoplay();
  //   }
  // }, [ready, startAutoplay]);

  // useEffect(() => {
  //   const width = size.width || 360;
  //   const height = size.height || 640;
  //   if (size.width === 0 && size.height === 0) {
  //     /** make sure the container scale to match the viewport size to display the entire container */
  //     if (height > width) {
  //       const ratio = document.body.clientHeight / height;
  //       setSize({ height: height * ratio, width: width * ratio });
  //     } else {
  //       const ratio = document.body.clientWidth / width;
  //       setSize({ height: height * ratio, width: width * ratio });
  //     }
  //   }
  // }, [size]);

  return (
    <div id="container" style={{ position: "relative" }}>
      {/* <Slide
        effect="fade"
        images={displayData?.imageList || []}
        ref={slideRef}
        size={[size.width, size.height]}
      />
      <div
        id="overlay"
        style={{
          position: "absolute",
          width: size.width,
          height: size.height,
          top: 0,
          left: 0,
          margin: 0,
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
      </div> */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- automation page only, no need consider a11y */}
      <audio ref={audioRef} />
      <button
        onClick={() => {
          if (audioRef.current) {
            void audioRef.current.play();
          }
        }}
        type="button"
      >
        play
      </button>
    </div>
  );
}
