import prisma from "../../../../../prisma/prisma";
import { ObjectId } from "bson";
import createPipeline from "./pipeline";

export async function GET(req: Request, res: Record<any, any>) {
    try {
        new ObjectId(res.params.id)
    } catch(_) {
        return new Response(JSON.stringify({error: "400 BAD REQUEST",  message: "Not a valid Object ID!"}), {
            status: 400
        })
    }
    let pipeline = createPipeline(res.params.id)
    let profile = await prisma.player.aggregateRaw({
        pipeline
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile[0] ?? null), {
        status: profile[0] ? 200 : 404
    })
}