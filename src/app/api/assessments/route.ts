import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError, isAdmin } from "@/lib/auth-helpers";

// GET /api/assessments - List available assessments
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const assessments = await prisma.assessment.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { questions: true } },
        menteeAssessments: {
          where: { menteeId: user.id },
          select: {
            id: true,
            completedAt: true,
            totalScore: true,
            percentage: true,
            levelAssigned: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = assessments.map((a) => ({
      id: a.id,
      title: a.title,
      titleEn: a.titleEn,
      description: a.description,
      descriptionEn: a.descriptionEn,
      durationMinutes: a.durationMinutes,
      questionCount: a._count.questions,
      isCompleted: a.menteeAssessments.some((ma) => ma.completedAt !== null),
      myAttempt: a.menteeAssessments[0] || null,
    }));

    return NextResponse.json({ assessments: result });
  } catch (error) {
    console.error("Get assessments error:", error);
    return serverError();
  }
}

// POST /api/assessments - Create assessment (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) {
      return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, durationMinutes = 120, maxViolations = 5 } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Titre et description requis" }, { status: 400 });
    }

    const assessment = await prisma.assessment.create({
      data: { title, description, durationMinutes, maxViolations },
    });

    return NextResponse.json({ assessment }, { status: 201 });
  } catch (error) {
    console.error("Create assessment error:", error);
    return serverError();
  }
}
