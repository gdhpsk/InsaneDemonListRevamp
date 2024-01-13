import prisma from "../../../../prisma/prisma";

export async function GET(req: Request, res: Record<any, any>) {
    let leaderboards = await prisma.player.findMany({
        where: {
            name: {not: "Removed"}
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(leaderboards))
}