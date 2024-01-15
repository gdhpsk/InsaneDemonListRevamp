import prisma from "../../../../../prisma/prisma";

export async function GET(request: Request) {
    let params = new URL(request.url).searchParams
    let levels = await prisma.level.count({
        where: {
            position: {
                gte: parseInt(params.get("start") || "0"),
                lte: parseInt(params.get("end") || "1000000000")
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify({count: levels}))
}