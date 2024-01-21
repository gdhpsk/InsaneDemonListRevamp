import { redirect } from "next/navigation"
import clientPromise from "../../../../../../adapter"

export async function GET(req: Request, res: Record<any, any>) {
    let db = await (await clientPromise).connect()
    let authDb = db.db("authentication")

    let token = await authDb.collection("tokens").findOne({token: res.params.token, type: "reset"})
    if(!token) return new Response("Could not find the token.", {status: 404})
    let user = await authDb.collection("users").findOne({_id: token.userId})
    if(!user) return new Response("Could not find the corresponding user.", {status: 404})
    await authDb.collection("users").updateOne({_id: token.userId}, {
        $set: {
            password: token.password
        }
    })
    await authDb.collection("tokens").deleteOne({token: res.params.token, type: "reset"})
    return redirect(`/?reset=${user.email}`)
}