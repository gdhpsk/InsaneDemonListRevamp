import { redirect } from "next/navigation"
import clientPromise from "../../../../../adapter"

export async function GET(req: Request, res: Record<any, any>) {
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")
    let user = await authDb.collection("users").findOne({$expr: {$eq: [{$toString: "$_id"}, res.params.id]}})
    if(!user) return new Response(JSON.stringify({error: "404 NOT FOUND", message: "Could not find the corresponding user"}), {status: 404})
    return new Response(JSON.stringify({user}))
}