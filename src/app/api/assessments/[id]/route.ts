import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, isAdmin } from "@/lib/auth-helpers";

// GET /api/assessments/:id - Get assessment detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        _count: { select: { questions: true } },
        questions: {
          select: { category: true, difficulty: true, type: true, points: true },
        },
        menteeAssessments: {
          where: { menteeId: user.id },
          select: {
            id: true,
            startedAt: true,
            completedAt: true,
            totalScore: true,
            percentage: true,
            levelAssigned: true,
            violationsCount: true,
            isDisqualified: true,
          },
        },
      },
    });

    if (!assessment) return notFound("Évaluation non trouvée");

    // Calculate category breakdown
    const categoryStats = {
      DATA_STRUCTURES: { count: 0, points: 0 },
      ALGORITHMS: { count: 0, points: 0 },
      OOP: { count: 0, points: 0 },
    };

    for (const q of assessment.questions) {
      const cat = q.category as keyof typeof categoryStats;
      if (categoryStats[cat]) {
        categoryStats[cat].count++;
        categoryStats[cat].points += q.points;
      }
    }

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        durationMinutes: assessment.durationMinutes,
        questionCount: assessment._count.questions,
        categoryStats,
        myAttempt: assessment.menteeAssessments[0] || null,
        isStarted: assessment.menteeAssessments.length > 0,
        isCompleted: assessment.menteeAssessments.some((ma: any) => ma.completedAt !== null),
      },
    });
  } catch (error) {
    console.error("Get assessment error:", error);
    return serverError();
  }
}

// PUT /api/assessments/:id - Update assessment (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) {
      return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.durationMinutes && { durationMinutes: body.durationMinutes }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.maxViolations && { maxViolations: body.maxViolations }),
      },
    });

    return NextResponse.json({ assessment });
  } catch (error) {
    console.error("Update assessment error:", error);
    return serverError();
  }
}
