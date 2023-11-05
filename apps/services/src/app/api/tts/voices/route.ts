import assert from "node:assert";
import { Redis } from "@upstash/redis";

const REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
assert(REDIS_REST_URL, "UPSTASH_REDIS_REST_URL is not set");
const REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
assert(REDIS_REST_TOKEN, "UPSTASH_REDIS_REST_TOKEN is not set");

const redis = Redis.fromEnv();

export async function GET() {
  const REGION = process.env.TTS_AZURE_REGION;
  assert(REGION, "TTS_AZURE_REGION is not set");
  const API_KEY = process.env.TTS_AZURE_API_KEY;
  assert(API_KEY, "TTS_AZURE_API_KEY is not set");

  const data = await redis.json.get("voices", "$");
  if (data) {
    return Response.json(data[0]);
  }

  const endpoint = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
  const headers = new Headers();
  headers.append("Ocp-Apim-Subscription-Key", API_KEY);
  const resp = await fetch(endpoint, {
    headers,
  });
  const r = await resp.json();
  await redis.json.set("voices", "$", r);

  return Response.json(r);
}
