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
    let level = await prisma.level.findFirst({
        where: {
            id: res.params.id
        },
        include: {
            packs: true,
            list: {
                select: {
                    id: true,
                    player: true,
                    verification: true,
                    beaten_when_weekly: true,
                    link: true
                }
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(level), {
        status: level ? 200 : 404
    })
}