import calc_points from "@/functions/points";
import prisma from "../../../../../prisma/prisma";

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
        let c = 0
        e.records = Array.from(new Set(e.records.map((x:any) => x.level.position)).values()).map((x:any) => calc_points(x))
        e.records = parseFloat(e.records.reduce((acc: any, cur: any) => acc + cur).toFixed(2))
        return e
    })
    profiles.sort((a: any, b: any) => b.records - a.records)
    profiles.map((e:any, i: number) => e.position = i+1)
    await prisma.$disconnect()
    return new Response(JSON.stringify(profiles))
}

export const revalidate = 0