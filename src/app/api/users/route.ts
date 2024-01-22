import { NextRequest, NextResponse } from "next/server"
import { middleware } from "../middleware"
import clientPromise from "../../../../adapter"


export async function GET(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "helper")
    if(auth.error) return NextResponse.json({error: auth.error, message: auth.message}, {status: auth.status})
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let users = await authDb.collection("users").find({emailVerified: {$exists: true}}).sort({"perms.idl": -1}).toArray()
    return NextResponse.json(users)
}