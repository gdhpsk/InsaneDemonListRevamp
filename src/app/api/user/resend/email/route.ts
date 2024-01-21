import { NextRequest, NextResponse } from "next/server"
import { middleware } from "../../../middleware"
import clientPromise from "../../../../../../adapter"
import { sendVerificationRequest } from "../../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, res: Record<any, any>) {
    await middleware(req)
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let exists = await authDb.collection("users").findOne({ $expr: { $eq: [{ $toString: "$_id" }, req.headers.get("user")] } })
    if (!exists) return NextResponse.json({ error: "401 UNAUTHORIZED", message: "You are not authorized to use this route." }, { status: 401 })
    if(exists.emailVerified) return NextResponse.json({ error: "400 BAD REQUEST", message: "Your email has already been verified!" }, { status: 400 })
    let token = await authDb.collection("tokens").findOne({userId: exists._id, type: "verify"})
    if(!token) return NextResponse.json({ error: "400 BAD REQUEST", message: "Could not find the token for the given user." }, { status: 400 })
    await sendVerificationRequest({
        identifier: exists.email,
        url: `${process.env.NEXT_PUBLIC_URL}/api/login/${token?.token}`,
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