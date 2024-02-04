import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { middleware } from "../middleware";

export async function GET(request: Request) {
    let params = new URL(request.url).searchParams
    let levels = await prisma.level.findMany({
        where: {
            position: {
                gte: parseInt(params.get("start") || "0"),
                lte: parseInt(params.get("end") || "1000000000")
            }
        },
        orderBy: {
            position: 'asc'
        },
        include: {
            weekly: {
                select: {
                    id: true,
                    date: true,
                    color: true
                }
            },
            packs: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                    position: true
                }
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(levels))
}

export async function PATCH(request: NextRequest) {
    let auth = await middleware(request, "moderator")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Array<Record<any, any>> = []
    try {
        body = await request.json()
        if(!Array.isArray(body)) throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }

    try {
       for(const level of body) {
        let exists = await prisma.level.findFirst({
            where: {
                id: level.id
            }
        })
        if(!exists || !level.position) continue;
        await prisma.$transaction([
            prisma.level.updateMany({
                where: {
                    AND: [
                        {position: {lte: level.position}},
                        {position: {gte: exists.position}}
                    ]
                },
                data: {
                    position: {
                        decrement: 1
                    }
                }
            }),
            prisma.level.updateMany({
                where: {
                    AND: [
                        {position: {gte: level.position}},
                        {position: {lte: exists.position}}
                    ]
                },
                data: {
                    position: {
                        increment: 1
                    }
                }
            }),
            prisma.level.updateMany({
                where: {
                    id: level.id
                },
                data: {
                    position: level.position
                }
            })
        ])
       }
    } catch(e: any) {
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 400})
    }
    return new Response(null, {status: 204})
}