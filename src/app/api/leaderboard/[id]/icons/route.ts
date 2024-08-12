import prisma from "../../../../../../prisma/prisma"
import { ObjectId } from "bson"

export async function GET(req: Request, res: Record<any, any>) {
    try {
        new ObjectId(res.params.id)
    } catch(_) {
        return new Response(JSON.stringify({error: "404 NOT FOUND", message: "Could not find the given players icon set."}), {
            status: 404
        })
    }
    let profile = await prisma.player.findFirst({
        where: {
            AND: [
                {
                    id: res.params.id
                },
                {
                    accountId: {not: null}
                }
            ]
        },
       select: {
            accountId: true
       }
    })
    if(profile) {
        let data = await fetch(`https://gdbrowser.com/api/profile/${profile.accountId}`)
        if(!data.ok) return new Response(JSON.stringify({error: "404 NOT FOUND", message: "Could not find the players icon set."}), {
            status: 404
        })
        let json = await data.json()
        // let color1 = json.findIndex((e: string) => e == "10")+1
        // let color2 = json.findIndex((e: string) => e == "11")+1
        // let cube = json.findIndex((e: string) => e == "21")+1
        // let ship = json.findIndex((e: string) => e == "22")+1
        // let ball = json.findIndex((e: string) => e == "23")+1
        // let ufo = json.findIndex((e: string) => e == "24")+1
        // let wave = json.findIndex((e: string) => e == "25")+1
        // let robot = json.findIndex((e: string) => e == "26")+1
        // let spider = json.findIndex((e: string) => e == "43")+1
        // let swing = json.findIndex((e: string) => e == "53")+1
        // let jetpack = json.findIndex((e: string) => e == "54")+1

        // let metadata = {
        //     color1: json[color1],
        //     color2: json[color2],
        //     cube: cube ? (json[cube] || "1") : "1",
        //     ship: ship ? (json[ship] || "1") : "1",
        //     ball: ball ? (json[ball] || "1") : "1",
        //     ufo: ufo ? (json[ufo] || "1") : "1",
        //     wave: wave ? (json[wave] || "1") : "1",
        //     robot: robot ? (json[robot] || "1") : "1",
        //     spider: spider ? (json[spider] || "1") : "1",
        //     swing: swing ? (json[swing] || "1") : "1",
        //     jetpack: jetpack ? (json[jetpack] || "1") : "1"
        // }
        let metadata = {
            color1: json.col1,
            color2: json.col2,
            cube: json.icon,
            ship: json.ship,
            ball: json.ball,
            ufo: json.ufo,
            wave: json.wave,
            robot: json.robot,
            spider: json.spider,
            swing: json.swing,
            jetpack: json.jetpack
        }
        let obj =Object.entries(metadata).filter(e => !["color1", "color2"].includes(e[0])).map(e => `https://gdicon.oat.zone/icon.png?type=${e[0]}&value=${e[1]}&color1=${metadata.color1}&color2=${metadata.color2}`);
        return new Response(JSON.stringify(obj))
    }
    await prisma.$disconnect()
    return new Response(JSON.stringify({error: "404 NOT FOUND", message: "Could not find the given players icon set."}), {
        status: 404
    })
}