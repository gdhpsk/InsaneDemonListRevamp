import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

export async function GET(request: Request) {
  let params = new URL(request.url).searchParams;
  let query = params.get("q")?.trim() || "";
  let type = params.get("type") || "all";

  if (!query) {
    return NextResponse.json({
      levels: [],
      platformers: [],
      players: [],
      packs: [],
    });
  }

  let results: Record<string, any> = {
    levels: [],
    platformers: [],
    players: [],
    packs: [],
  };

  try {
    if (type === "all" || type === "levels") {
      results.levels = await prisma.level.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { publisher: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: {
          position: "asc",
        },
        take: 10,
        include: {
          weekly: {
            select: {
              id: true,
              date: true,
              color: true,
            },
          },
          packs: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              name: true,
              color: true,
              position: true,
            },
          },
        },
      });
    }

    if (type === "all" || type === "platformers") {
      results.platformers = await prisma.platformer.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { publisher: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: {
          position: "asc",
        },
        take: 10,
        include: {
          weekly: {
            select: {
              id: true,
              date: true,
              color: true,
            },
          },
          packs: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              name: true,
              color: true,
              position: true,
            },
          },
        },
      });
    }

    if (type === "all" || type === "players") {
      results.players = await prisma.player.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        take: 10,
        include: {
          records: {
            select: {
              id: true,
            },
          },
        },
      });
    }

    if (type === "all" || type === "packs") {
      results.packs = await prisma.pack.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        orderBy: {
          position: "asc",
        },
        take: 10,
        distinct: ["name"],
      });
    }

    await prisma.$disconnect();
    return NextResponse.json(results);
  } catch (e: any) {
    await prisma.$disconnect();
    return NextResponse.json(
      {
        error: "500 INTERNAL SERVER ERROR",
        message: `Search failed: ${e.message}`,
      },
      { status: 500 },
    );
  }
}
