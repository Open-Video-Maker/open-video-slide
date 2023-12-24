import { getObject } from "@/app/api/_rpc/r2";

export async function GET() {
  const video = await getObject({ Key: "output.mp4" });

  return new Response(video, {
    headers: {
      "Content-Type": "video/mp4",
    },
  });
}
