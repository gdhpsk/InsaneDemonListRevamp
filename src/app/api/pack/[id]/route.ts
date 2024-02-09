import prisma from "../../../../../prisma/prisma";
import { ObjectId } from "bson";
import createPipeline from "./pipeline";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../../middleware";

export async function GET(req: Request, res: Record<any, any>) {
    try {
        new ObjectId(res.params.id)
    } catch(_) {
        return new Response(JSON.stringify({error: "400 BAD REQUEST",  message: "Not a valid Object ID!"}), {
            status: 400
        })
    }
    let p = await prisma.pack.findFirst({
        where: {
            id: res.params.id
        },
        select: {
            name: true
        }
    })
    if(!p) return NextResponse.json({error: "400 BAD REQUEST",  message: "Not a valid Object ID!"}, {status: 400})
    let pipeline = createPipeline(p.name)
    let pack = await prisma.pack.aggregateRaw({
        pipeline
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(pack[0] ?? null), {
        status: pack[0] ? 200 : 404
    })
}

export async function DELETE(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})

    let pack = await prisma.pack.findFirst({where: {id: res.params.id}})
    if(!pack) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find pack."}, {status: 400})
    let count =  await prisma.pack.count()
    
        try {
            await prisma.$transaction([
                prisma.pack.updateMany({
                    where: {
                        AND: [
                            {position: {lte: count}},
                            {position: {gte: pack.position}}
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
                            {position: {gte: count}},
                            {position: {lte: pack.position}}
                        ]
                    },
                    data: {
                        position: {
                            increment: 1
                        }
                    }
                }),
                prisma.pack.deleteMany({
                    where: {
                        name: pack.name
                    }
                })
            ])
        } catch(e: any) {
            return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
        }
    await prisma.$disconnect()
    return new Response(null, {status: 204})
}

export async function PATCH(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})

    let body: Record<any, any> = {}
    try {
        body = await req.json()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }
    let pack = await prisma.pack.findFirst({where: {id: res.params.id}})
    if(!pack) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find pack."}, {status: 400})

    if(body.addedLevels) {
        try {
            let actual_levels = await Promise.all(body.addedLevels.filter(async (x:any) => await prisma.level.findFirst({
                where: {
                    id: x
                },
                select: {
                    id: true
                }
            })))
            if(!actual_levels.length) throw new Error()
            await prisma.pack.createMany({
                data: actual_levels.map(e => {
                    return {
                        name: pack?.name || "",
                        color: pack?.color || "",
                        position: pack?.position || 1,
                        levelId: e
                    }
                })
            })
        } catch(e: any) {
            
        }
    }

    if(body.removedLevels) {
        try {
            await prisma.pack.deleteMany({
                where: {
                    name: pack.name,
                    levelId: { in: body.removedLevels }
                }
            })
        } catch(_) {}
    }
    
    if(body.position && body.position != pack.position) {
        try {
            await prisma.$transaction([
                prisma.pack.updateMany({
                    where: {
                        AND: [
                            {position: {lte: body.position}},
                            {position: {gte: pack.position}}
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
                            {position: {gte: body.position}},
                            {position: {lte: pack.position}}
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
                        name: pack.name
                    }, data: {
                        position: body.position
                    }
                })
            ])
        } catch(e: any) {

        }
    }

    await prisma.pack.updateMany({
        where: {
            name: pack.name
        },
        data: {
            name: body.name || pack.name,
            color: body.color || pack.color
        }
    })

    await prisma.$disconnect()
    return new Response(null, {status: 204})
}