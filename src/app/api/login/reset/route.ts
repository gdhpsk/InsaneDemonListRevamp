import { redirect } from "next/navigation"
import clientPromise from "../../../../../adapter"
import { NextResponse } from "next/server"
import { setPasswordReset } from "../../auth/[...nextauth]/route"
import bcrypt from "bcrypt"

export async function POST(req: Request, res: Record<any, any>) {
    let body: Record<any, any> = {}
    try {
        body = await req.json()
        if(!body.password || !body.email || typeof body.password !== 'string' || typeof body.email !== 'string') throw new Error()
    } catch(_) {
        return NextResponse.json({error: "400 BAD REQUEST", message: "Not a valid JSON body."}, {status: 400})
    }
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let user = await authDb.collection("users").findOne({email: body.email})
    if(!user) return new Response("Could not find the corresponding user.", {status: 404})
    let exists = await authDb.collection("tokens").findOne({userId: user._id, type: "reset"})
    let token = crypto.randomUUID()
    if(!exists) {
    await authDb.collection("tokens").insertOne({
        token,
        userId: user._id,
        createdAt: new Date(),
        password: await bcrypt.hash(body.password, 10),
        type: "reset"
    }) 
} else {
    await authDb.collection("tokens").updateOne({userId: user._id, type: "reset"}, {
        $set: {
            password: await bcrypt.hash(body.password, 10)
        }
    })
}
    await setPasswordReset({
        identifier: body.email,
        url: `${process.env.NEXT_PUBLIC_URL}/api/login/reset/${exists ? exists.token : token}`,
        provider: {
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                  user: process.env.EMAIL_SERVER_USER,
                  pass: process.env.EMAIL_SERVER_PASSWORD
                }
              },
              from: process.env.EMAIL_FROM
        }
    })
    return new Response(null, {status: 204})
}