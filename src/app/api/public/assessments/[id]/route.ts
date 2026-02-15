import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound, serverError } from "@/lib/auth-helpers";

// GET /api/public/assessments/:id - Public assessment detail (no auth)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id, isActive: true },
      include: {
        _count: { select: { questions: true } },
        questions: {
          select: { category: true, difficulty: true, type: true, points: true },
        },
      },
    });

    if (!assessment) return notFound("Évaluation non trouvée");

    const categoryStats: Record<string, { count: number; points: number }> = {
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
      },
    });
  } catch (error) {
    console.error("Public get assessment error:", error);
    return serverError();
  }
}
