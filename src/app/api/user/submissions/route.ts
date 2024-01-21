import { NextRequest, NextResponse } from "next/server"
import { middleware } from "../../middleware"
import prisma from "../../../../../prisma/prisma";

export async function POST(req: NextRequest, res: Record<any, any>) {
    await middleware(req)
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if(typeof body.level !== 'string' || typeof body.player !== 'string' || typeof body.link !== 'string' || typeof body.comments !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Invalid JSON body."}, {status: 400})
    }
    let valid = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/.test(body.link)
    if(!valid) return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid youtube link!"}, {status: 400})
    try {
        await prisma.$transaction([
            prisma.submission.create({
                data: {
                    level: body.level,
                    player: body.player,
                    link: body.link,
                    comments: body.comments,
                    createdAt: new Date(),
                    editedAt: new Date(),
                    userId: req.headers.get("user") || ""
                }
            })
        ])
    } catch(e: any) {
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 400})
    }
    return new Response(null, {status: 204})
}