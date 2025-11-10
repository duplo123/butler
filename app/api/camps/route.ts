import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get("familyId");
    const lifecycleStage = searchParams.get("lifecycleStage");

    if (!familyId) {
      return NextResponse.json(
        { error: "familyId is required" },
        { status: 400 }
      );
    }

    const where: any = { familyId };
    if (lifecycleStage) {
      where.lifecycleStage = lifecycleStage;
    }

    const camps = await prisma.camp.findMany({
      where,
      include: {
        activities: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(camps);
  } catch (error) {
    console.error("Error fetching camps:", error);
    return NextResponse.json(
      { error: "Failed to fetch camps" },
      { status: 500 }
    );
  }
}
