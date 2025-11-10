import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const camp = await prisma.camp.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    });

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    return NextResponse.json(camp);
  } catch (error) {
    console.error("Error fetching camp:", error);
    return NextResponse.json(
      { error: "Failed to fetch camp" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      location,
      startDate,
      endDate,
      pricing,
      pricingDetails,
      eligibilityCriteria,
      registrationProcess,
    } = body;

    const camp = await prisma.camp.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        location: location || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        pricing: pricing ? parseFloat(pricing) : undefined,
        pricingDetails: pricingDetails || undefined,
        eligibilityCriteria: eligibilityCriteria || undefined,
        registrationProcess: registrationProcess || undefined,
      },
      include: {
        activities: true,
      },
    });

    return NextResponse.json(camp);
  } catch (error) {
    console.error("Error updating camp:", error);
    return NextResponse.json(
      { error: "Failed to update camp" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.camp.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Camp deleted successfully" });
  } catch (error) {
    console.error("Error deleting camp:", error);
    return NextResponse.json(
      { error: "Failed to delete camp" },
      { status: 500 }
    );
  }
}
