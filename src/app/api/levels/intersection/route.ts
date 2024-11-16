import prisma from "../../../../../prisma/prisma";
import clientPromise from "../../../../../adapter"
import createPipeline from "./pipeline";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let body = await request.json()
    if(!body.levels || !Array.isArray(body.levels)) return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    let db = await (await clientPromise).connect()
    let recordDb = db.db("InsaneDemonList").collection("records")
    let players = await recordDb.aggregate(createPipeline(body.levels)).toArray()
    return new Response(JSON.stringify(players))
}