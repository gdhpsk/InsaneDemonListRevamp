import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
    let params = new URL(request.url).searchParams
    let levels = await prisma.level.findMany({
        where: {
            position: {
                gte: parseInt(params.get("start") || "0"),
                lte: parseInt(params.get("end") || "1000000000")
            }
        },
        orderBy: {
            position: 'asc'
        },
        include: {
            weekly: {
                select: {
                    id: true,
                    date: true,
                    color: true
                }
            },
            packs: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                    position: true
                }
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(levels))
}