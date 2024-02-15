import calc_points from "@/functions/points";
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
    let count = await prisma.level.count()
    let pos_array = Array.from(new Array(count)).map((_, i) => i+1)
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
        e.points = Array.from(new Set(e.records.map((x:any) => x.level.position)).values())
        e.missing = await Promise.all(pos_array.filter(x => !e.points.includes(x)).map(async (x:any) => await prisma.level.findFirst({where: {AND: [{position: x}, {formerRank: undefined}]}})))
        e.missing = e.missing.filter((x:any) => x)
        e.records = e.records.sort((a: any, b: any) => a.level.position - b.level.position).sort((a: any, b: any) => b.verification - a.verification)
        e.packs = (packs as any).filter((x: any) => x.levels.every((y: any) => e.points.includes(y.position))).sort((a: any, b: any) => a.position - b.position)
        e.points = parseFloat(e.records.map((x:any) => calc_points(x)).reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2))
        return e
    }))
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile[0]))
}

export const revalidate = 0