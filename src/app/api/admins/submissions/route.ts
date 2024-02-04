import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../prisma/prisma"
import { middleware } from "../../middleware"
import cache from "../../../../../cache.json"

export async function GET(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let submissions = await prisma.submission.findMany()
    await prisma.$disconnect()
    return NextResponse.json(submissions)
}

export async function PATCH(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if(typeof body.id !== 'string' || !cache.status[body.status]) throw Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }
    let submission = await prisma.submission.findFirst({
        where: {
            id: body.id
        }
    })
    if(!submission) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find the given submission ID"}, {status: 400})
    try {
        if(body.status == 1) {
            let level = await prisma.level.findFirst({
                where: {
                    name: body.level || submission.level,
                    publisher: body.publisher || submission.publisher
                },
                select: {
                    id: true,
                    weekly: {
                        select: {
                            date: true
                        }
                    },
                    list: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            if(!level)  return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find the given level"}, {status: 400})
            let player = await prisma.player.findFirst({
                where: {
                    name: body.player || submission.player
                },
                select: {
                    id: true
                }
            })
            if(!player)  {
                player = await prisma.player.create({
                    data: {
                        name: body.player || submission.player
                    }
                })
            }
            await prisma.$transaction([
                prisma.submission.update({
                    where: {
                        id: body.id
                    },
                    data: {
                        status: body.status
                    }
                }),
                prisma.record.upsert({
                    where: {
                        levelId_playerId: {
                            levelId: level.id,
                            playerId: player.id
                        }
                    },
                    update: {
                        link: body.link || submission.link,
                        verification: level.list?.length ? undefined : true,
                        beaten_when_weekly: level.weekly?.date && level.weekly.date+604_800_000 < Date.now() ? true : undefined
                    },
                    create: {
                        link: body.link || submission.link,
                        verification: level.list?.length ? undefined : true,
                        beaten_when_weekly: level.weekly?.date && level.weekly.date+604_800_000 < Date.now() ? true : undefined,
                        levelId: level.id,
                        playerId: player.id
                    }
                })
            ])
        } else {
            await prisma.$transaction([
                prisma.submission.update({
                    where: {
                        id: body.id
                    },
                    data: {
                        status: body.status
                    }
                })
            ])
        }
    } catch(e: any) {
        await prisma.$disconnect()
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 500})
    }
    await prisma.$disconnect()
    return new Response(null, {status: 204})
}