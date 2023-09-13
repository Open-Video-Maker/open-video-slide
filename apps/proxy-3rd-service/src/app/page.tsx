"use client";

import { useState } from "react";
import {
  Card,
  Text,
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

    const audioContext = new AudioContext();
    audioContext.decodeAudioData(buffer, (audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    });

    // const url = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));

    // setResult(url);
  };

  const textValid = text.length > 0;

  return (
    <main className="flex flex-col items-center py-8 w-1/2 m-auto">
      <h1 className="text-2xl my-6 font-bold">TTS playground</h1>
      <div className="w-full">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text mb="lg">Text to speech</Text>

          <Stack gap="xl">
            <Select
              size="md"
              label="Language"
              placeholder="Pick value"
              data={["React", "Angular", "Vue", "Svelte"]}
            />
            <Group grow gap="xl">
              <Select
                size="md"
                label="Voice"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
              />
              <Select
                size="md"
                label="Voice style"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
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
                  marks={[
                    { value: 0, label: "Slow" },
                    { value: 50, label: "Regular" },
                    { value: 100, label: "Fast" },
                  ]}
                />
              </Stack>
              <Select
                size="md"
                label="Voice pitch"
                placeholder="Pick value"
                data={["React", "Angular", "Vue", "Svelte"]}
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

          <Group grow gap="xl" my="sm">
            <Group p="xs">
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
            <Button disabled={!textValid} variant="filled">
              Save to media
            </Button>
          </Group>
        </Card>
      </div>
    </main>
  );
}
