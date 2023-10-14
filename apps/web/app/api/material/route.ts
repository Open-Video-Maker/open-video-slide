import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

const SEPARATOR = ";;";

export async function POST(req: Request): Promise<Response> {
  const prisma = new PrismaClient();
  const { content, imageList } =
    (await req.json()) as Prisma.MaterialCreateInput;

  if (typeof content === "string" && Array.isArray(imageList)) {
    try {
      const material = await prisma.material.create({
        data: {
          content,
          imageList: imageList.join(SEPARATOR),
        },
      });
      return new Response(JSON.stringify(material), {});
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
    });
    return new Response(JSON.stringify(material || {}), {});
  } catch (error) {
    return new Response(error, { status: 500 });
  }
}
