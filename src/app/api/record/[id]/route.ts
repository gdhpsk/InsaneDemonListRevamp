import prisma from "../../../../../prisma/prisma";
import { ObjectId } from "bson";

export async function GET(req: Request, res: Record<any, any>) {
    try {
        new ObjectId(res.params.id)
    } catch(_) {
        return new Response(JSON.stringify({error: "400 BAD REQUEST",  message: "Not a valid Object ID!"}), {
            status: 400
        })
    }
    let profile = await prisma.record.findFirst({
        where: {
            id: res.params.id
        },
        select: {
            id: true,
            beaten_when_weekly: true,
            verification: true,
            link: true,
            level: true,
            player: true
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile), {
        status: profile ? 200 : 404
    })
}