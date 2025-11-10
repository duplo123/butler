import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STAGES = ["considering", "applied", "registered", "archived"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { lifecycleStage } = body;

    if (!lifecycleStage || !VALID_STAGES.includes(lifecycleStage)) {
      return NextResponse.json(
        { 
          error: "Invalid lifecycle stage",
          validStages: VALID_STAGES 
        },
        { status: 400 }
      );
    }

    const camp = await prisma.camp.update({
      where: { id },
      data: {
        lifecycleStage,
        stageUpdatedAt: new Date(),
      },
      include: {
        activities: true,
      },
    });

    return NextResponse.json(camp);
  } catch (error) {
    console.error("Error updating camp stage:", error);
    return NextResponse.json(
      { error: "Failed to update camp stage" },
      { status: 500 }
    );
  }
}
