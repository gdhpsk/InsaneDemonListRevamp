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
    let weekly = await prisma.weekly.findFirst({
        where: {
            id: res.params.id
        },
        include: {
            level: {
                select: {
                    name: true,
                    ytcode: true,
                    publisher: true,
                    position: true
                }
            },
            platformer: {
                select: {
                    name: true,
                    ytcode: true,
                    publisher: true,
                    position: true
                }
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(weekly), {
        status: weekly ? 200 : 404
    })
}