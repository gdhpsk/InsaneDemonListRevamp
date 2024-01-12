import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
    let levels = await prisma.level.findMany({
        include: {
            packs: true,
            list: {
                include: {
                    player: true,
                }
            }
        }
    })
    return new Response(JSON.stringify(levels))
}