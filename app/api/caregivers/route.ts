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

    const caregivers = await prisma.caregiver.findMany({
      where: { familyId },
    });

    return NextResponse.json(caregivers);
  } catch (error) {
    console.error("Error fetching caregivers:", error);
    return NextResponse.json(
      { error: "Failed to fetch caregivers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { familyId, name, email, phone } = body;

    if (!familyId || !name) {
      return NextResponse.json(
        { error: "familyId and name are required" },
        { status: 400 }
      );
    }

    const caregiver = await prisma.caregiver.create({
      data: {
        familyId,
        name,
        email: email || null,
        phone: phone || null,
      },
    });

    return NextResponse.json(caregiver, { status: 201 });
  } catch (error) {
    console.error("Error creating caregiver:", error);
    return NextResponse.json(
      { error: "Failed to create caregiver" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.caregiver.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Caregiver deleted successfully" });
  } catch (error) {
    console.error("Error deleting caregiver:", error);
    return NextResponse.json(
      { error: "Failed to delete caregiver" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, phone } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "id and name are required" },
        { status: 400 }
      );
    }

    const caregiver = await prisma.caregiver.update({
      where: { id },
      data: {
        name,
        email: email || null,
        phone: phone || null,
      },
    });

    return NextResponse.json(caregiver);
  } catch (error) {
    console.error("Error updating caregiver:", error);
    return NextResponse.json(
      { error: "Failed to update caregiver" },
      { status: 500 }
    );
  }
}
