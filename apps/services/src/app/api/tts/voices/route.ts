import assert from "node:assert";

export async function GET() {
  const REGION = process.env.TTS_AZURE_REGION;
  const API_KEY = process.env.TTS_AZURE_API_KEY;
  assert(REGION, "TTS_AZURE_REGION is not set");
  assert(API_KEY, "TTS_AZURE_API_KEY is not set");

  const endpoint = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`;

  const headers = new Headers();
  headers.append("Ocp-Apim-Subscription-Key", API_KEY);
  const resp = await fetch(endpoint, {
    headers,
  });
  const r = await resp.json();

  return Response.json(r);
}
