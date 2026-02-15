import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError } from "@/lib/auth-helpers";

// POST /api/pathways/[id]/enroll - Enroll in a pathway
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;

    const pathway = await prisma.pathway.findUnique({
      where: { id, isActive: true },
    });
    if (!pathway) return notFound("Pathway not found");

    const enrollment = await prisma.pathwayEnrollment.upsert({
      where: { userId_pathwayId: { userId: user.id, pathwayId: id } },
      update: {},
      create: { userId: user.id, pathwayId: id },
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("Enroll pathway error:", error);
    return serverError();
  }
}

// DELETE /api/pathways/[id]/enroll - Unenroll from a pathway
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;

    await prisma.pathwayEnrollment.deleteMany({
      where: { userId: user.id, pathwayId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unenroll pathway error:", error);
    return serverError();
  }
}
