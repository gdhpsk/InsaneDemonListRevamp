import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
    let levels = await prisma.weekly.findMany({
        include: {
            level: {
                select: {
                    name: true,
                    ytcode: true,
                    publisher: true,
                    position: true
                }
            },
            platformer: {
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
    return new Response(JSON.stringify(levels))
}

export const revalidate = 0