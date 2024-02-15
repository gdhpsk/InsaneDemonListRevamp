import calc_points from "@/functions/points";
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
                    }
                }
            }
        }
    })
    profiles = profiles.map((e:any) => {
        e.records = e.records.map((x:any) => calc_points(x.level.position))
        e.records = e.records.reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2)
        return e
    })
    profiles.sort((a: any, b: any) => b.records - a.records)
    profiles.map((e:any, i: number) => e.position = i+1)
    let profile = profiles.findIndex((e:any) => e.id == res.params.id)
    await prisma.$disconnect()
    return new Response(JSON.stringify(profile == -1 ? null : {...profiles[profile], next: profiles[profile+1]?.id, last: profiles[profile-1]?.id, count: profiles.length}), {
        status: profile != -1 ? 200 : 404
    })
}

export const revalidate = 0