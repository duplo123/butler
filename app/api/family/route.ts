import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const families = await prisma.family.findMany({
      include: {
        caregivers: true,
        children: true,
      },
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error("Error fetching families:", error);
    return NextResponse.json(
      { error: "Failed to fetch families" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const family = await prisma.family.create({
      data: {},
    });

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error("Error creating family:", error);
    return NextResponse.json(
      { error: "Failed to create family" },
      { status: 500 }
    );
  }
}
