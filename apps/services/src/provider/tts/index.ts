import assert from "node:assert";
import {
  ResultReason,
  SpeechConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";

const subscriptionKey = process.env.TTS_AZURE_API_KEY;
const serviceRegion = process.env.TTS_AZURE_REGION;

interface TTSServiceOptions {
  language?: string;
  voiceName?: string;
}

export class TTSService {
  private speechConfig: SpeechConfig;
  private synthesizer: SpeechSynthesizer;

  constructor({ language, voiceName }: TTSServiceOptions = {}) {
    assert(subscriptionKey, "TTS_AZURE_API_KEY is not set");
    assert(serviceRegion, "TTS_AZURE_REGION is not set");

    this.speechConfig = SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion,
    );
    this.speechConfig.speechSynthesisLanguage = language ?? "zh-CN";
    this.speechConfig.speechSynthesisVoiceName =
      voiceName ?? "zh-CN-XiaoxiaoNeural";

    this.synthesizer = new SpeechSynthesizer(this.speechConfig);
  }

  speakTextAsync(text: string) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      console.log("speakTextAsync", text);
      this.synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            resolve(result.audioData);
          } else {
            console.trace(
              "Speech synthesis canceled, " +
                result.errorDetails +
                "\nDid you update the subscription info?",
            );
            reject(result.errorDetails);
          }
          this.synthesizer.close();
        },
        (err) => {
          console.trace("err - " + err);
          reject(err);
          this.synthesizer.close();
        },
      );
    });
  }

  speakSSMLAsync(ssml: string) {
    return new Promise<{
      audioData: ArrayBuffer;
      audioDuration: number;
    }>((resolve, reject) => {
      console.log("speakSSMLAsync", ssml);
      this.synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            resolve({
              audioData: result.audioData,
              audioDuration: result.audioDuration,
            });
          } else {
            console.trace(
              "Speech synthesis canceled, " +
                result.errorDetails +
                "\nDid you update the subscription info?",
            );
            reject(result.errorDetails);
          }
          this.synthesizer.close();
        },
        (err) => {
          console.trace("err - " + err);
          reject(err);
          this.synthesizer.close();
        },
      );
    });
  }
}
