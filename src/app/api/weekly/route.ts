import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
    let level = await prisma.weekly.findFirst({
        where: {
            date: {
                lte: Date.now() + 604_800_000
            }
        },
        include: {
            level: {
                select: {
                    name: true,
                    ytcode: true,
                    publisher: true,
                    position: true
                }
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(level), {
        status: level ? 200 : 404
    })
}