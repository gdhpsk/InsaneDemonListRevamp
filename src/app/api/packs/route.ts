import prisma from "../../../../prisma/prisma";
import createPipeline from "./pipeline";

export async function GET(request: Request) {
    let packs = await prisma.pack.aggregateRaw({
        pipeline: createPipeline()
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(packs))
}