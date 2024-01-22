import { NextRequest, NextResponse } from "next/server"
import { middleware } from "../../middleware"
import prisma from "../../../../../prisma/prisma";

export async function POST(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req)
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if(typeof body.level !== 'string'  || typeof body.publisher !== 'string' || typeof body.player !== 'string' || typeof body.link !== 'string' || typeof body.comments !== 'string') throw new Error()
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
                    userId: req.headers.get("user") || "",
                    publisher: body.publisher,
                    status: 0
                }
            })
        ])
    } catch(e: any) {
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 400})
    }
    return new Response(null, {status: 204})
}

export async function GET(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req)
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let submissions = await prisma.submission.findMany({
        where: {
            userId: req.headers.get("user") || ""
        }
    })
    return NextResponse.json(submissions)
}

export async function PATCH(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req)
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if(typeof body.id !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Invalid JSON body."}, {status: 400})
    }
    let exists = await prisma.submission.findFirst({
        where: {
            id: body.id,
            userId: req.headers.get("user") || ""
        }
    })
    if(!exists)  return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find the given submission"}, {status: 400})
    if(exists.status > 0) return NextResponse.json({error: "400 BAD REQUEST", message: "Cannot edit a submission that's not pending"}, {status: 400})
    if(typeof body.link !== 'string') {
    let valid = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/.test(body.link)
    if(!valid) return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid youtube link!"}, {status: 400})
    }
    try {
        await prisma.$transaction([
            prisma.submission.update({where:{id: body.id},
                data: {
                    level: typeof body.level === 'string' ? body.level : exists.level,
                    player: typeof body.player === 'string' ? body.player : exists.player,
                    link: typeof body.link === 'string' ? body.link : exists.link,
                    comments: typeof body.comments === 'string' ? body.comments : exists.comments,
                    editedAt: new Date(),
                    userId: req.headers.get("user") || "",
                    publisher: typeof body.publisher === 'string' ? body.publisher : exists.publisher,
                    status: 0
                }
            })
        ])
    } catch(e: any) {
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 400})
    }
    return new Response(null, {status: 204})
}

export async function DELETE(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req)
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if(typeof body.id !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Invalid JSON body."}, {status: 400})
    }
    let exists = await prisma.submission.findFirst({
        where: {
            id: body.id,
            userId: req.headers.get("user") || ""
        }
    })
    if(!exists)  return NextResponse.json({error: "400 BAD REQUEST", message: "Could not find the given submission"}, {status: 400})
    if(exists.status > 0) return NextResponse.json({error: "400 BAD REQUEST", message: "Cannot delete a submission that's not pending"}, {status: 400})
    try {
        await prisma.$transaction([
            prisma.submission.delete({where:{id: body.id}})
        ])
    } catch(e: any) {
        return NextResponse.json({error: "500 INTERNAL SERVER ERROR", message: `Operation failed due to: ${e.message}.`}, {status: 400})
    }
    return new Response(null, {status: 204})
}