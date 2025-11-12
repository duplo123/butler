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

    const children = await prisma.child.findMany({
      where: { familyId },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { familyId, name, age, gender, dateOfBirth } = body;

    if (!familyId || !name || !age || !dateOfBirth) {
      return NextResponse.json(
        { error: "familyId, name, age, and dateOfBirth are required" },
        { status: 400 }
      );
    }

    const child = await prisma.child.create({
      data: {
        familyId,
        name,
        age: parseInt(age),
        gender: gender || null,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    console.error("Error creating child:", error);
    return NextResponse.json(
      { error: "Failed to create child" },
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

    await prisma.child.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Child deleted successfully" });
  } catch (error) {
    console.error("Error deleting child:", error);
    return NextResponse.json(
      { error: "Failed to delete child" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, age, gender, dateOfBirth } = body;

    if (!id || !name || !age || !dateOfBirth) {
      return NextResponse.json(
        { error: "id, name, age, and dateOfBirth are required" },
        { status: 400 }
      );
    }

    const child = await prisma.child.update({
      where: { id },
      data: {
        name,
        age: parseInt(age),
        gender: gender || null,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    return NextResponse.json(child);
  } catch (error) {
    console.error("Error updating child:", error);
    return NextResponse.json(
      { error: "Failed to update child" },
      { status: 500 }
    );
  }
}
