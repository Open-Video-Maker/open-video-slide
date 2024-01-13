import { PrismaClient, type Prisma } from "@prisma/client";

const SEPARATOR = ";;";

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

export async function GET(req: Request): Promise<Response> {
  const prisma = new PrismaClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const audio = await prisma.audio.findUnique({
      where: { id: id ?? undefined },
      include: { material: true },
    });

    if (audio) {
      return new Response(
        JSON.stringify({
          status: 0,
          data: {
            ...audio,
            material: {
              ...audio.material,
              contentList: audio.material?.contentList.split(SEPARATOR),
              imageList: audio.material?.imageList?.split(SEPARATOR),
            },
          },
        }),
        {},
      );
    }

    return new Response(
      JSON.stringify({
        status: -1,
        message: "Not Found",
      }),
    );
  } catch (error) {
    return new Response("Validation Failed", { status: 500 });
  }
}
