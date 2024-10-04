import { NextRequest } from "next/server";
import clientPromise from "../../../../../adapter"
import createPipeline from "./pipeline";

export async function GET(req: NextRequest, res: Record<any, any>) {
    let db = await (await clientPromise).connect()
    let playerDb = db.db("InsaneDemonList").collection("players")
    let getAll = req.nextUrl.searchParams.get("all") == "true"
    if(getAll) {
        let profiles = await playerDb.aggregate(createPipeline("", undefined, undefined, false, undefined)).toArray()
        return new Response(JSON.stringify(profiles))
    }
    let page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1"), 1)
    let max = Math.max(parseInt(req.nextUrl.searchParams.get("max") || "25"), 10)
    let name = req.nextUrl.searchParams.get("name") || ""
    let nationality = req.nextUrl.searchParams.get("nationality") || undefined
    if(page-1) {
        let profiles = await playerDb.aggregate(createPipeline(name, page, max, false, nationality)).toArray()
        return new Response(JSON.stringify({profiles}))
    }
    let [profiles, total] = await Promise.all([
        playerDb.aggregate(createPipeline(name, page, max, false, nationality)).toArray(),
        playerDb.aggregate(createPipeline(name, undefined, undefined, true, nationality)).toArray()
    ])
    let count: number = total[0].documents ?? 0
    return new Response(JSON.stringify({profiles, pages: Math.ceil(count / max)}))
}

export const revalidate = 0