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
    let pipeline = createPipeline(res.params.id)
    let profile = await prisma.player.aggregateRaw({
        pipeline
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile[0] ?? null), {
        status: profile[0] ? 200 : 404
    })
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

    let exists = await prisma.player.findFirst({where: {id: res.params.id}})
    if(!exists) return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find player ID"}, {status: 400})

    await prisma.player.update({
        where: {id: res.params.id},
        data: {
            name: body.name || exists.name,
            nationality: body.nationality ?? exists.nationality,
            abbr: body.abbr ?? exists.abbr,
            accountId: body.accountId ?? exists.accountId,
            reliable: body.reliable ?? exists.reliable
        }
    })
    await prisma.$disconnect()
    return new Response(null, {status: 204})
}

export async function DELETE(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "moderator")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})

    try {
        await prisma.$transaction([
            prisma.record.deleteMany({
                where: {
                    playerId: res.params.id
                }
            }),
            prisma.player.delete({
                where:{id: res.params.id}
            })
        ])
    } catch(_) {}
await prisma.$disconnect()
    return new Response(null, {status: 204})
}