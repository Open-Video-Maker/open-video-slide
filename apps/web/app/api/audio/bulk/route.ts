import { PrismaClient, type Prisma, type Audio } from "@prisma/client";

async function createManyAudios(audios: Audio[]): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await prisma.$transaction(
      audios.map((audio) =>
        prisma.audio.create({
          data: { ...audio },
        }),
      ),
    );
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: Request): Promise<Response> {
  const prisma = new PrismaClient();
  const { audios } = (await req.json()) as {
    audios: Prisma.AudioGetPayload<{ include: { material: true } }>[];
  };
  if (
    Array.isArray(audios) &&
    audios.length !== 0 &&
    audios.every((audio) => audio.url && audio.detail)
  ) {
    try {
      await createManyAudios(audios).finally(() => {
        void prisma.$disconnect();
      });
      return new Response(JSON.stringify({ status: 0, data: {} }));
    } catch (error) {
      return new Response(error, { status: 500 });
    }
  } else {
    return new Response("Unexpected input types", { status: 500 });
  }
}
