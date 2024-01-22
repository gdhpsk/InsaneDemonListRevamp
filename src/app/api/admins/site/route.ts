import { NextRequest, NextResponse } from "next/server"
import { middleware } from "../../middleware"
import clientPromise from "../../../../../adapter"
import cache from "../../../../../cache.json"


export async function PATCH(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "moderator")
    if (auth.error) return NextResponse.json({ error: auth.error, message: auth.message }, { status: auth.status })
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if (typeof body.admin !== 'string') throw new Error()
    } catch (_) {
        return NextResponse.json({ error: "400 BAD REQUEST", message: "Not a valid JSON body" }, {status: 400})
    }
    let user = JSON.parse(req.headers.get("full_user") || "{}")
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let admin = await authDb.collection("users").findOne({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.admin] }, {$gt: ["$perms.idl", 0]}] } })
    if(!admin) return NextResponse.json({ error: "400 BAD REQUEST", message: "Could not find the given admin!" }, {status: 400})
    if(admin.perms.idl >= user.perms.idl && user.perms.idl != cache.perms.length) return NextResponse.json({ error: "400 BAD REQUEST", message: "This admin is not a lower rank than you!" }, {status: 400})
    if(typeof body.id === 'string' && body.admin != body.id) {
        admin = await authDb.collection("users").findOne({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.id] }, {$lt: ["$perms.idl", 1]}] } })
        if(!admin) return NextResponse.json({ error: "400 BAD REQUEST", message: "Could not find the new user!" }, {status: 400})
        await authDb.collection("users").updateOne({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.admin] }, {$gt: ["$perms.idl", 0]}] } }, {
            $unset: {
                "perms.idl": ""
            }
        })
    }
    if(typeof body.perms === 'number') {
        if(!cache.perms[body.perms-1] || ((user.perms?.idl || 0) <= body.perms && user.perms?.idl != cache.perms.length)) return NextResponse.json({ error: "400 BAD REQUEST", message: "You do not have permission to assign this role to someone." }, {status: 400})
    }
    await authDb.collection("users").updateOne({ $expr: { $eq: [{ $toString: "$_id" }, admin._id.toString()] } }, {
        $set: {
            "perms.idl": typeof body.perms === 'number' ? body.perms : admin.perms
        }
    })
    
    return new Response(null, {status: 204})
}


export async function DELETE(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "moderator")
    if (auth.error) return NextResponse.json({ error: auth.error, message: auth.message }, { status: auth.status })
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if (typeof body.admin !== 'string') throw new Error()
    } catch (_) {
        return NextResponse.json({ error: "400 BAD REQUEST", message: "Not a valid JSON body" }, {status: 400})
    }
    let user = JSON.parse(req.headers.get("full_user") || "{}")
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let admin = await authDb.collection("users").findOne({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.admin] }, {$gt: ["$perms.idl", 0]}] } })
    if(!admin) return NextResponse.json({ error: "400 BAD REQUEST", message: "Could not find the given admin!" }, {status: 400})
    if(admin.perms.idl >= user.perms.idl && user.perms.idl != cache.perms.length) return NextResponse.json({ error: "400 BAD REQUEST", message: "This admin is not a lower rank than you!" }, {status: 400})
  
    await authDb.collection("users").updateOne({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.admin] }, {$gt: ["$perms.idl", 0]}] } }, {
        $unset: {
            "perms.idl": ""
        }
    })
    
    return new Response(null, {status: 204})
}

export async function POST(req: NextRequest, res: Record<any, any>) {
    let auth = await middleware(req, "moderator")
    if (auth.error) return NextResponse.json({ error: auth.error, message: auth.message }, { status: auth.status })
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if (typeof body.id !== 'string' || typeof body.perms !== 'number') throw new Error()
    } catch (_) {
        return NextResponse.json({ error: "400 BAD REQUEST", message: "Not a valid JSON body" }, {status: 400})
    }
    let user = JSON.parse(req.headers.get("full_user") || "{}")
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let admin = await authDb.collection("users").findOne({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.id] }, {$gt: ["$perms.idl", 0]}] } })
    if(admin) return NextResponse.json({ error: "400 BAD REQUEST", message: "This admin already exists!" }, {status: 400})
    if(body.perms >= user.perms.idl && user.perms.idl != cache.perms.length) return NextResponse.json({ error: "400 BAD REQUEST", message: "You cannot assign someone this rank!" }, {status: 400})
  
    let doc = await authDb.collection("users").findOneAndUpdate({ $expr: { $and: [{ $eq: [{ $toString: "$_id" }, body.id] }] } }, {
        $set: {
            "perms.idl": body.perms
        }
    })
    
    return NextResponse.json(doc, {status: 201})
}