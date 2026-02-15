import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError, isAdmin, badRequest } from "@/lib/auth-helpers";

// GET /api/admin/pathways - List all pathways (admin)
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Admin required" }, { status: 403 });

    const pathways = await prisma.pathway.findMany({
      include: {
        assessments: {
          include: { assessment: { select: { id: true, title: true } } },
          orderBy: { order: "asc" },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ pathways });
  } catch (error) {
    console.error("Admin get pathways error:", error);
    return serverError();
  }
}

// POST /api/admin/pathways - Create a pathway (admin)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Admin required" }, { status: 403 });

    const body = await request.json();
    const { title, titleEn, subtitle, subtitleEn, description, descriptionEn, icon, color, image, level, duration, assessmentIds } = body;

    if (!title || !description) return badRequest("Title and description are required");

    const pathway = await prisma.pathway.create({
      data: {
        title,
        titleEn,
        subtitle,
        subtitleEn,
        description,
        descriptionEn,
        icon,
        color,
        image,
        level: level || "beginner",
        duration,
        assessments: assessmentIds?.length
          ? {
              create: assessmentIds.map((aId: string, i: number) => ({
                assessmentId: aId,
                order: i,
              })),
            }
          : undefined,
      },
      include: { assessments: true },
    });

    return NextResponse.json({ pathway }, { status: 201 });
  } catch (error) {
    console.error("Create pathway error:", error);
    return serverError();
  }
}
