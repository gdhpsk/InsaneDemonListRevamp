import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
    let records = await prisma.record.findMany()
    await prisma.$disconnect()
    return new Response(JSON.stringify(records))
}