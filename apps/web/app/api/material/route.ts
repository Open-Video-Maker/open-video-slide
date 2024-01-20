import { PrismaClient } from "@prisma/client";

const SEPARATOR = ";;";

export async function POST(req: Request): Promise<Response> {
  const prisma = new PrismaClient();
  const { contentList, imageList } = (await req.json()) as {
    contentList: string[];
    imageList: string[];
  };

  if (Array.isArray(contentList) && Array.isArray(imageList)) {
    try {
      const material = await prisma.material.create({
        data: {
          contentList: contentList.join(SEPARATOR),
          imageList: imageList.join(SEPARATOR),
        },
      });
      return new Response(
        JSON.stringify({
          status: 0,
          data: { material },
        }),
        {},
      );
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
    const material = await prisma.material.findUnique({
      where: { id: id ?? undefined },
      include: { audios: true },
    });
    return new Response(
      JSON.stringify({
        status: 0,
        data: { material },
      }),
      {},
    );
  } catch (error) {
    return new Response("Validation Failed", { status: 500 });
  }
}
