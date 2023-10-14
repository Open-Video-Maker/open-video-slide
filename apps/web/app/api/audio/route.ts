import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request): Promise<Response> {
  const prisma = new PrismaClient();
  const { url, detail, materialId } =
    (await req.json()) as Prisma.AudioGetPayload<{
      include: { material: true };
    }>;

  if (typeof url === "string" && typeof detail === "string") {
    try {
      const audio = await prisma.audio.create({
        data: {
          url,
          detail,
          materialId,
        },
      });
      return new Response(JSON.stringify(audio), {});
    } catch (error) {
      return new Response(error, { status: 500 });
    }
  }
  return new Response("Unexpected input types", { status: 500 });
}
