import calc_points, { calc_points_plat } from "@/functions/points";
import prisma from "../../../../../../prisma/prisma";

export async function GET(req: Request, res: Record<any, any>) {
    let profiles: Record<any, any> = await prisma.player.findMany({
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
    profiles = profiles.map((e:any) => {
        e.platformer = e.records?.filter((x:any) => x.platformer).map((x:any) => calc_points_plat(x.platformer.position))
        e.platformer = e.platformer?.reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2)
        e.records = e.records?.filter((x:any) => x.level).map((x:any) => calc_points(x.level.position))
        e.records = e.records?.reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2)
        return e
    })
    let obj: Record<any, any> = {
        next: {},
        last: {}
    }
    profiles.sort((a: any, b: any) => b.records - a.records)
    let profile = profiles.findIndex((e:any) => e.id == res.params.id)
    obj.next.classic = profiles[profile+1]?.id
    obj.last.classic = profiles[profile-1]?.id
    profiles.sort((a: any, b: any) => b.platformer - a.platformer)
    let plat_placement = profiles.findIndex((e:any) => e.id == res.params.id)
    obj.next.platformer = profiles[plat_placement+1]?.id
    obj.last.platformer = profiles[plat_placement-1]?.id
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile == -1 ? null : {...profiles[plat_placement], classic: profile+1, platformer: plat_placement+1, ...obj, count: profiles.length}), {
        status: profile != -1 ? 200 : 404
    })
}

export const revalidate = 0