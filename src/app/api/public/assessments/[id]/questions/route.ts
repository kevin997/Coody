import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound, serverError } from "@/lib/auth-helpers";

const GUEST_QUESTION_LIMIT = 3;

// GET /api/public/assessments/:id/questions - Get preview questions for guests (first 3 only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id, isActive: true },
    });

    if (!assessment) return notFound("Évaluation non trouvée");

    const questions = await prisma.question.findMany({
      where: { assessmentId: id },
      include: {
        options: {
          select: {
            id: true,
            optionText: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
        codingChallenge: {
          select: {
            id: true,
            starterCode: true,
            testCases: true,
            hints: true,
            constraints: true,
            expectedComplexity: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: GUEST_QUESTION_LIMIT,
    });

    const totalQuestions = await prisma.question.count({
      where: { assessmentId: id },
    });

    const result = questions.map((q, index) => ({
      ...q,
      order: index + 1,
      answered: false,
      previousAnswer: null,
    }));

    return NextResponse.json({
      questions: result,
      totalQuestions,
      previewCount: GUEST_QUESTION_LIMIT,
      isPreview: true,
      timeRemainingSeconds: assessment.durationMinutes * 60,
      menteeAssessmentId: null,
    });
  } catch (error) {
    console.error("Public get questions error:", error);
    return serverError();
  }
}
