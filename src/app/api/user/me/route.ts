import { NextRequest, NextResponse } from "next/server"
import { middleware } from "../../middleware"
import clientPromise from "../../../../../adapter"
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest, res: Record<any, any>) {
    await middleware(req)
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let exists = await authDb.collection("users").findOne({ $expr: { $eq: [{ $toString: "$_id" }, req.headers.get("user")] } })
    if (!exists) return NextResponse.json({ error: "401 UNAUTHORIZED", message: "You are not authorized to use this route." }, { status: 401 })
    exists.token =req.headers.get("authorization")
    return NextResponse.json({user: exists})
}