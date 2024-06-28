import calc_points from "@/functions/points";
import prisma from "../../../../prisma/prisma";

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
                    }
                }
            }
        }
    })
    let profiles = leaderboards.map((e:any) => {
        e.records = e.records.map((x:any) => calc_points(x.level.position))
        e.records = e.records.reduce((acc: any, cur: any) => acc + cur, 0).toFixed(2)
        return e
    })
    profiles.sort((a: any, b: any) => b.records - a.records)
    profiles.map((e:any, i: number) => {
        if(i == 0) return e.position = i+1
        if(profiles[i-1].records == e.records && profiles[i-1].position == 1) return e.position = 1
        return e.position = i+1
    })
    await prisma.$disconnect()
    return new Response(JSON.stringify(profiles))
}

export const revalidate = 0