import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get("familyId");

    if (!familyId) {
      return NextResponse.json(
        { error: "familyId is required" },
        { status: 400 }
      );
    }

    // Get all camps that are not archived (active camps)
    const camps = await prisma.camp.findMany({
      where: {
        familyId,
        lifecycleStage: {
          not: "archived",
        },
        startDate: {
          not: null,
        },
      },
      include: {
        activities: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    // Detect conflicts (overlapping dates)
    const conflicts: Array<{ camp1Id: string; camp2Id: string; overlap: string }> = [];
    
    for (let i = 0; i < camps.length; i++) {
      for (let j = i + 1; j < camps.length; j++) {
        const camp1 = camps[i];
        const camp2 = camps[j];
        
        if (!camp1.startDate || !camp1.endDate || !camp2.startDate || !camp2.endDate) {
          continue;
        }

        const start1 = new Date(camp1.startDate);
        const end1 = new Date(camp1.endDate);
        const start2 = new Date(camp2.startDate);
        const end2 = new Date(camp2.endDate);

        // Check for overlap
        if (start1 <= end2 && start2 <= end1) {
          conflicts.push({
            camp1Id: camp1.id,
            camp2Id: camp2.id,
            overlap: `${Math.max(start1.getTime(), start2.getTime())} to ${Math.min(end1.getTime(), end2.getTime())}`,
          });
        }
      }
    }

    return NextResponse.json({
      camps,
      conflicts,
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    );
  }
}
