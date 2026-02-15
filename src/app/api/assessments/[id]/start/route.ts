import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, badRequest, serverError } from "@/lib/auth-helpers";

// POST /api/assessments/:id/start - Start an assessment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });

    if (!assessment) return notFound("Évaluation non trouvée");
    if (!assessment.isActive) return badRequest("Cette évaluation n'est plus active");

    // Check if already has an attempt
    const existing = await prisma.menteeAssessment.findUnique({
      where: { menteeId_assessmentId: { menteeId: user.id, assessmentId: id } },
    });

    // If already started but not completed, return existing (resume)
    if (existing && !existing.completedAt) {
      return NextResponse.json({
        menteeAssessment: existing,
        message: "Évaluation déjà en cours",
      });
    }

    // If completed, allow retake: delete old attempt + answers + violations
    if (existing?.completedAt) {
      await prisma.menteeAnswer.deleteMany({
        where: { menteeAssessmentId: existing.id },
      });
      await prisma.violationLog.deleteMany({
        where: { menteeAssessmentId: existing.id },
      });
      await prisma.menteeAssessment.delete({
        where: { id: existing.id },
      });
    }

    // Create new mentee assessment
    const menteeAssessment = await prisma.menteeAssessment.create({
      data: {
        menteeId: user.id,
        assessmentId: id,
        maxScore: 0, // Will be calculated on submit
      },
    });

    return NextResponse.json({ menteeAssessment }, { status: 201 });
  } catch (error) {
    console.error("Start assessment error:", error);
    return serverError();
  }
}
