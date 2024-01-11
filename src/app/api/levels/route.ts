import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
    let levels = await prisma.level.findMany()
    return new Response(JSON.stringify(levels))
}