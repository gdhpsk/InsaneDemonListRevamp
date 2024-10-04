import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { middleware } from "../../middleware";
import createPipeline from "./pipeline";

export async function GET(request: Request) {
    let packs = await prisma.pack.aggregateRaw({
        pipeline: createPipeline()
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(packs))
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
    let count = await prisma.pack.count({
        where: {
            type: "platformer"
        }
    })
    try {
       for(const pack of body) {
        let exists = await prisma.pack.findFirst({
            where: {
                id: pack.id
            }
        })
        if(!exists || !pack.position) continue;
        if(pack.position < 1 || pack.position > count+1) continue
        await prisma.$transaction([
            prisma.pack.updateMany({
                where: {
                    AND: [
                        {position: {lte: pack.position}},
                        {position: {gte: exists.position}},
                        {type: "platformer"}
                    ]
                },
                data: {
                    position: {
                        decrement: 1
                    }
                }
            }),
            prisma.pack.updateMany({
                where: {
                    AND: [
                        {position: {gte: pack.position}},
                        {position: {lte: exists.position}},
                        {type: "platformer"}
                    ]
                },
                data: {
                    position: {
                        increment: 1
                    }
                }
            }),
            prisma.pack.updateMany({
                where: {
                    name: exists.name
                },
                data: {
                    position: pack.position
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
        if(typeof body.name !== 'string' || typeof body.position !== 'number' || typeof body.color !== 'string' || !Array.isArray(body.levels)) throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }
    let actual_levels = await Promise.all(body.levels.filter(async x => await prisma.platformer.findFirst({
        where: {
            id: x.id
        },
        select: {
            id: true
        }
    })))
    if(!actual_levels.length) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find the given level ID"}, {status: 400})
    let count = await prisma.pack.count({
        where: {
            type: "platformer"
        }
    })
    if(body.position < 1 || body.position > count+1) return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid position range."}, {status: 400})
    try {
        let pack = await prisma.$transaction([
            prisma.pack.updateMany({
                where: {
                    AND: [
                        {position: {gte: body.position}},
                        {type: "platformer"}
                    ]
                },
                data: {
                    position: {
                        increment: 1
                    }
                }
            }),
            prisma.pack.createMany({
                data: actual_levels.map(x => {
                    return {
                        position: body.position,
                        name: body.name,
                        color: body.color,
                        type: "platformer",
                        levelId: x.id
                    }
                })
            })
        ])
        await prisma.$disconnect()
            return NextResponse.json(pack, {status: 201})
} catch(e: any) {
    await prisma.$disconnect()
    return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
}
}

export const revalidate = 0