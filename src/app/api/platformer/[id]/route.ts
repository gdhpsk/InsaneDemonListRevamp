import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { ObjectId } from "bson";
import { middleware } from "../../middleware";

export async function GET(req: Request, res: Record<any, any>) {
    let isInt = !isNaN(res.params.id)
    if(!isInt) {
        try {
            new ObjectId(res.params.id)
        } catch(_) {
            return new Response(JSON.stringify({error: "400 BAD REQUEST",  message: "Not a valid Object ID!"}), {
                status: 400
            })
        }
    }
    let level = await prisma.platformer.findFirst({
        where: {
            [isInt ? "position" : "id"]: isInt ? parseInt(res.params.id) : res.params.id
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
            },
            list: {
                orderBy: {
                    verification: "desc"
                },
                select: {
                    id: true,
                    player: true,
                    verification: true,
                    beaten_when_weekly: true,
                    link: true,
                    time: true
                }
            }
        }
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(level), {
        status: level ? 200 : 404
    })
}

export async function PATCH(req: NextRequest) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}
    let removeReason: boolean = false

    try {
        body = await req.json()
        if(typeof body.id !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }

    let level = await prisma.platformer.findFirst({where: {id: body.id}, include: {
        weekly: true,
        packs: true
    }})
    if(!level) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find level."}, {status: 400})
    
    if(body.deletedRecords) {
        await prisma.record.deleteMany({
            where: {
                id: { in: body.deletedRecords }
            }
        })
    }

    if(body.editedRecords) {
       try {
            for(const item of body.editedRecords) {
                if(!item.name) continue;
                let player = await prisma.player.findFirst({
                    where: {
                        name: item.name
                    },
                    select: {
                        id: true
                    }
                })
                if(!player)  {
                    player = await prisma.player.create({
                        data: {
                            name: item.name
                        },
                        select: {
                            id: true
                        }
                    })
                }
                if(item.verification) {
                    await prisma.record.updateMany({
                        where: {
                            levelId: level.id,
                            verification: true
                        },
                        data: {
                            verification: null
                        }
                    })
                }
                await prisma.record.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        link: item.link,
                        playerId: player.id,
                        verification: item.verification,
                        beaten_when_weekly: item.beaten_when_weekly
                    }
                })
            }
       } catch(_) {

       }
    }

    if(body.position && body.position != level.position) {
        let count = await prisma.platformer.count()
        if(body.position < 1 || body.position > count+1) return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid position range."}, {status: 400})
        let obj: Record<any, any> = {
            position: body.position,
            removalDate: null,
            removalReason: null,
            formerRank: null
        }
        if(body.position <= ((process.env.NEXT_PUBLIC_PLATFORMERS || 20) as number)) {
            removeReason = true
        } else {
            obj = {
                position: body.position
            }
        }
        await prisma.$transaction([
            prisma.platformer.updateMany({
                where: {
                    AND: [
                        {position: {lte: body.position}},
                        {position: {gte: level.position}}
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
                        {position: {gte: body.position}},
                        {position: {lte: level.position}}
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
                data: obj
            })
        ])
    }

    if(body.weekly) {
        await prisma.weekly.upsert({
            where: {
                levelId: level.id
            },
            update: {
                date: new Date(body.weekly?.date || level.weekly?.date).getTime(),
                color: body.weekly?.color || level.weekly?.date
            },
            create: {
                date: new Date(body.weekly?.date || Date.now()).getTime(),
                color: body.weekly?.color || "#000000",
                levelId: level.id
            }
        })
    }

    if(body.packs) {
        try {
            let data = body.packs.filter((x:any) => !level?.packs.find((y: any) => y.id == x.id)).map((x:any) => {
                return {
                    name: x.name,
                    levelId: level?.id,
                    color: x.color,
                    position: x.position,
                    type: "platformer"
                }
            })
           if(data.length) {
            await prisma.$transaction([
                prisma.pack.deleteMany({
                    where: {
                        id: { in: level?.packs.filter((x:any) => !body?.packs.find((y: any) => y.id == x.id)).map((x:any) => x.id)}
                    }
                }),
                prisma.pack.createMany({
                    data
                })
            ])
           } else {
            await prisma.$transaction([
                prisma.pack.deleteMany({
                    where: {
                        id: { in: level?.packs.filter((x:any) => !body?.packs.find((y: any) => y.id == x.id)).map((x:any) => x.id)}
                    }
                })
            ])
           }
        } catch(e: any) {
            return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
        }
    }

    await prisma.platformer.updateMany({
        where: {
            id: level.id
        },
        data: {
            name: body.name || level.name,
            publisher: body.publisher || level.publisher,
            ytcode: body.ytcode || level.ytcode,
            removalReason: removeReason ? null : (body.removalReason || level.removalReason)
        }
    })
    await prisma.$disconnect()
    return new Response(null, {status: 204})
}

export async function DELETE(req: NextRequest) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}

    try {
        body = await req.json()
        if(typeof body.id !== 'string' && body.removalReason !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }

    let level = await prisma.platformer.findFirst({where: {id: body.id}})
    if(!level) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find level."}, {status: 400})
    let count =  await prisma.platformer.count()
    
    if(body.removalReason) {
        try {
            await prisma.$transaction([
                prisma.platformer.updateMany({
                    where: {
                        AND: [
                            {position: {lte: count}},
                            {position: {gte: level.position}}
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
                            {position: {gte: count}},
                            {position: {lte: level.position}}
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
                    data: {
                        position: count,
                        removalDate: new Date(Date.now()).toDateString(),
                        removalReason: body.removalReason,
                        formerRank: level.position
                    }
                })
            ])
        } catch(e: any) {
            return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
        }
    } else {
        try {
            await prisma.$transaction([
                prisma.platformer.updateMany({
                    where: {
                        AND: [
                            {position: {lte: count}},
                            {position: {gte: level.position}}
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
                            {position: {gte: count}},
                            {position: {lte: level.position}}
                        ]
                    },
                    data: {
                        position: {
                            increment: 1
                        }
                    }
                }),
                prisma.record.deleteMany({
                    where: {
                        levelId: level.id
                    }
                }),
                prisma.pack.deleteMany({
                    where: {
                        levelId: level.id
                    }
                }),
                prisma.weekly.deleteMany({
                    where: {
                        levelId: level.id
                    }
                }),
                prisma.platformer.delete({
                    where: {
                        id: level.id
                    }
                })
            ])
        } catch(e: any) {
            await prisma.$disconnect()
            return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
        }
    }
    await prisma.$disconnect()
    return new Response(null, {status: 204})
}