import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { middleware } from "../middleware";

export async function GET(request: Request) {
    let params = new URL(request.url).searchParams
    let levels = await prisma.platformer.findMany({
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
                orderBy: {
                    position: "asc"
                },
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
    let auth = await middleware(request, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Array<Record<any, any>> = []
    try {
        body = await request.json()
        if(!Array.isArray(body)) throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }
    let count = await prisma.platformer.count()
    try {
       for(const level of body) {
        let exists = await prisma.platformer.findFirst({
            where: {
                id: level.id
            }
        })
        if(!exists || !level.position) continue;
        if(level.position < 1 || level.position > count+1) continue
        await prisma.$transaction([
            prisma.platformer.updateMany({
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
            prisma.platformer.updateMany({
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
            prisma.platformer.updateMany({
                where: {
                    id: level.id
                },
                data: level.position > ((process.env.NEXT_PUBLIC_PLATFORMERS || 20) as number) ? {
                    position: level.position
                } : {
                    position: level.position,
                    removalDate: null,
                    removalReason: null,
                    formerRank: null
                }
            })
        ])
       }
       await prisma.$disconnect()
    } catch(e: any) {
        await prisma.$disconnect()
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
    }
    return new Response(null, {status: 204})
}

export async function POST(request: NextRequest) {
    let auth = await middleware(request, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}
    try {
        body = await request.json()
        if(typeof body.name !== 'string' || typeof body.position !== 'number' || typeof body.publisher !== 'string' || typeof body.ytcode !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }
    let count = await prisma.platformer.count()
    if(body.position < 1 || body.position > count+1) return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid position range."}, {status: 400})
    try {
        let level = await prisma.$transaction([
            prisma.platformer.updateMany({
                where: {
                    AND: [
                        {position: {gte: body.position}}
                    ]
                },
                data: {
                    position: {
                        increment: 1
                    }
                }
            }),
            prisma.platformer.create({
                data: {
                    position: body.position,
                    name: body.name,
                    publisher: body.publisher,
                    ytcode: body.ytcode
                }
            })
        ])
            return NextResponse.json(level, {status: 201})
} catch(e: any) {
    return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
}
}