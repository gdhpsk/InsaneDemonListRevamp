import calc_points, { calc_points_plat } from "@/functions/points";
import prisma from "../../../../../../../prisma/prisma";

export async function GET(req: Request, res: Record<any, any>) {
    let leaderboards = await prisma.player.findMany({
        where: {
            name: {not: "Removed"}
        },
        include: {
            records: {
                select: {
                    level: {
                        select: {
                            position: true
                        }
                    },
                    platformer: {
                        select: {
                            position: true
                        }
                    }
                }
            }
        }
    })
    let obj: Array<any> = []
    leaderboards.forEach((e:any) => {
        if(!e.nationality) return;
        let ind = obj.findIndex((x:any) => x.name.toLowerCase().replaceAll("_", " ") == e.nationality.toLowerCase().replaceAll("_", " "))
        if(ind != -1) {
            obj[ind].records = [...obj[ind].records, ...e.records]
        } else {
            e.name = e.nationality.replaceAll("_", " ")
            obj.push(e)
        }
    })
    let profiles = obj.map((e:any) => {
        e.platformer = Array.from(new Set(e.records?.filter((x:any) => x.platformer).map((x:any) => x.platformer.position) || []).values()).map((x:any) => calc_points_plat(x))
        e.platformer = parseFloat(e.platformer?.reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2) || "0")
        e.records = Array.from(new Set(e.records?.filter((x:any) => x.level).map((x:any) => x.level.position) || []).values()).map((x:any) => calc_points(x))
        e.records = parseFloat(e.records?.reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2) || "0")
        return e
    })
    profiles.sort((a: any, b: any) => b.records - a.records)
    let profile = profiles.findIndex((e:any) => e.abbr == res.params.id)
    profiles.sort((a: any, b: any) => b.platformer - a.platformer)
    let plat_placement = profiles.findIndex((e:any) => e.abbr == res.params.id)
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile == -1 ? null : {...profiles[plat_placement], classic: profile+1, platformer: plat_placement+1, next: {classic: profiles[profile+1]?.abbr, platformer: profiles[plat_placement+1]?.abbr}, last: {classic: profiles[profile-1]?.abbr, platformer: profiles[plat_placement-1]?.abbr}, count: profiles.length}), {
        status: profile != -1 ? 200 : 404
    })
}