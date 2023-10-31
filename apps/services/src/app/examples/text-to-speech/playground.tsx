import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Text,
  Title,
  Button,
  Group,
  ActionIcon,
  Progress,
  Select,
  Slider,
  Stack,
  Textarea,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import useSWR from "swr";
import * as R from "ramda";

import { VoicePitch, VoicePitchValues } from "./constants";

export default function Playground() {
  const [text, setText] = useState("1");
  const [lang, setLang] = useState<string | null>();
  const [voice, setVoice] = useState<string | null>();
  const [voiceStyle, setVoiceStyle] = useState<string | null>();
  const [voiceSpeed, setVoiceSpeed] = useState(50);
  const [voicePitch, setVoicePitch] = useState<string | null>(
    VoicePitch.Default,
  );

  const [audio, setAudio] = useState<ArrayBuffer>();
  const [audioUrl, setAudioUrl] = useState<string>("");

  const {
    data: voices,
    isLoading: isLoadingVoices,
    error: voicesError,
  } = useSWR("/api/tts/voices");

  const voicesData = useMemo(() => {
    if (!voices) return {};
    return R.groupBy((voice) => (voice as any).LocaleName)(voices);
  }, [voices]);

  // console.log(voicesData);

  const langList = useMemo(
    () =>
      Object.keys(voicesData).filter((lang) => /(Chinese|English)/i.test(lang)),
    [voicesData],
  );

  const voiceList = useMemo(() => {
    if (!lang) return [];
    return (voicesData[lang] ?? []).map((v) => (v as any).LocalName);
  }, [voicesData, lang]);

  const voiceStyleList = useMemo(() => {
    if (!voice || !lang) return [];
    return (
      (
        (voicesData[lang] ?? []).find(
          (v) => (v as any).LocalName === voice,
        ) as any
      )?.StyleList ?? ["General"]
    ).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1));
  }, [voice]);

  useEffect(() => {
    if (!langList.length) return;
    setLang(langList[0]);
  }, [langList]);

  useEffect(() => {
    if (!voiceList.length) return;
    setVoice(voiceList[0]);
  }, [voiceList]);

  useEffect(() => {
    if (!voiceStyleList.length) return;
    setVoiceStyle(voiceStyleList[0]);
  }, [voiceStyleList]);

  const generate = async (text: string) => {
    const voiceName = (
      voicesData[lang!]!.find((v) => {
        return (v as any).LocalName === voice;
      }) as any
    ).ShortName;

    const langCode = (
      voicesData[lang!]!.find((v) => {
        return (v as any).LocalName === voice;
      }) as any
    ).Locale;

    const payload = {
      text,
      lang: langCode,
      voiceName,
      voiceStyle,
      voiceSpeed,
      voicePitch,
    };
    const res = await fetch("/api/tts/ssml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    // const { ssml } = await res.json();

    // console.log(payload, ssml);
    const buffer = await res.arrayBuffer();
    setAudio(buffer);
    setAudioUrl(URL.createObjectURL(new Blob([buffer], { type: "audio/wav" })));

    const audioContext = new AudioContext();
    audioContext.decodeAudioData(buffer, (audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    });
  };

  const textValid = text.length > 0;

  return (
    <>
      <h1 className="text-2xl my-6 font-bold">TTS playground</h1>
      <div className="w-full">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Title order={2} mb="xl">
            Text to speech
          </Title>

          <Stack gap="xl">
            <Select
              size="md"
              label="Language"
              placeholder="Pick a language"
              allowDeselect={false}
              data={langList}
              value={lang}
              onChange={setLang}
            />
            <Group grow gap="xl">
              <Select
                size="md"
                label="Voice"
                placeholder="Pick value"
                allowDeselect={false}
                data={voiceList}
                value={voice}
                onChange={setVoice}
              />
              <Select
                size="md"
                label="Voice style"
                placeholder="Pick value"
                data={voiceStyleList}
                value={voiceStyle}
                onChange={setVoiceStyle}
              />
            </Group>
            <Group grow gap="xl" style={{ alignItems: "stretch" }}>
              <Stack gap={0} justify="space-between">
                <Text size="md" fw={500}>
                  Speech speed
                </Text>
                <Slider
                  size="sm"
                  mt="xs"
                  style={{ flex: 1 }}
                  color="blue"
                  defaultValue={50}
                  marks={[
                    { value: 0, label: "Slow" },
                    { value: 50, label: "Regular" },
                    { value: 100, label: "Fast" },
                  ]}
                  onChangeEnd={setVoiceSpeed}
                />
              </Stack>
              <Select
                size="md"
                label="Voice pitch"
                placeholder="Pick value"
                defaultValue={VoicePitch.Default}
                data={VoicePitchValues}
                onChange={setVoicePitch}
              />
            </Group>
            <Textarea
              autosize
              size="md"
              minRows={5}
              aria-label="Text prepared for TTS"
              placeholder="Type your text in here"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Stack>

          <Text mt="lg">Preview</Text>
          <Group grow gap="xl">
            <Group p="xs" className="border border-slate-300 rounded">
              <ActionIcon
                variant="filled"
                aria-label="Generate"
                disabled={!textValid}
                onClick={() => generate(text)}
              >
                <IconPlayerPlay style={{ width: "70%", height: "70%" }} />
              </ActionIcon>
              <Progress style={{ flex: 1 }} value={0} />
            </Group>
            <Button size="lg" disabled={!textValid} variant="filled">
              Save to media
            </Button>
          </Group>
        </Card>
      </div>
    </>
  );
}
