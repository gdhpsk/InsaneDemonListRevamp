import calc_points, { calc_points_plat } from "@/functions/points";
import prisma from "../../../../../../prisma/prisma";
import createPipeline from "./pipeline";

export async function GET(req: Request, res: Record<any, any>) {
    let leaderboards = await prisma.player.findMany({
        where: {
            abbr: res.params.id
        },
        include: {
            records: {
                select: {
                    player: true,
                    id: true,
                    verification: true,
                    beaten_when_weekly: true,
                    link: true,
                    level: {
                        select: {
                            id: true,
                            ytcode: true,
                            publisher: true,
                            position: true,
                            name: true
                        }
                    },
                    platformer: {
                        select: {
                            id: true,
                            ytcode: true,
                            publisher: true,
                            position: true,
                            name: true
                        }
                    }
                }
            }
        }
    })
    if(!leaderboards.length)  return new Response("null", {
        status: 404
    })
    let packs = await prisma.pack.aggregateRaw({
        pipeline: createPipeline()
    })
    let count1 = await prisma.level.count()
    let pos_array1 = Array.from(new Array(count1)).map((_, i) => i+1)
    let count2 = await prisma.level.count()
    let pos_array2 = Array.from(new Array(count2)).map((_, i) => i+1)
    let obj: Record<any, any> = {}
    leaderboards.forEach((e:any, ind: number) => {
        if(ind) {
            obj.records = [...obj.records, ...e.records]
        } else {
            e.name = e.nationality.replaceAll("_", " ")
            obj = {...e}
        }
    })
    obj = [obj]
    let profile = await Promise.all(obj.map(async (e:any) => {
        e.classic = Array.from(new Set(e.records?.filter((x:any) => x.level).map((x:any) => x.level.position) || []).values())
        e.platformer = Array.from(new Set(e.records?.filter((x:any) => x.platformer).map((x:any) => x.platformer.position) || []).values())
        e.missing_classic = await Promise.all(pos_array1.filter(x => !e.classic.includes(x)).map(async (x:any) => await prisma.level.findFirst({where: {AND: [{position: x}, {formerRank: undefined}]}})))
        e.missing_classic = e.missing_classic.filter((x:any) => x)
        e.missing_platformer = await Promise.all(pos_array2.filter(x => !e.platformer.includes(x)).map(async (x:any) => await prisma.platformer.findFirst({where: {AND: [{position: x}, {formerRank: undefined}]}})))
        e.missing_platformer = e.missing_platformer.filter((x:any) => x)
        e.records = e.records?.filter((e:any) => e.level).sort((a: any, b: any) => a.level.position - b.level.position).sort((a: any, b: any) => b.verification - a.verification)
        e.platformers = e.records?.filter((e:any) => e.platformer).sort((a: any, b: any) => a.level.position - b.level.position).sort((a: any, b: any) => b.verification - a.verification)
        e.packs = (packs as any).filter((x: any) => (x.type == "classic" && x.levels.every((y: any) => e.classic.includes(y.position))) || (x.type == "platformer" && x.levels.every((y: any) => e.platformer.includes(y.position)))).sort((a: any, b: any) => a.position - b.position)
        e.classic = parseFloat(e.records?.map((x:any) => calc_points(x)).reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2) || "0")
        e.platformer = parseFloat(e.platformer?.map((x:any) => calc_points_plat(x)).reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2) || "0")
        return e
    }))
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile[0]))
}

export const revalidate = 0