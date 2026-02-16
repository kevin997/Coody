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

    // If completed, allow retake with cooldown
    if (existing?.completedAt) {
      // Enforce 24-hour cooldown between attempts to discourage answer memorization
      const RETAKE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
      const timeSinceCompletion = Date.now() - existing.completedAt.getTime();
      if (timeSinceCompletion < RETAKE_COOLDOWN_MS) {
        const hoursRemaining = Math.ceil((RETAKE_COOLDOWN_MS - timeSinceCompletion) / (60 * 60 * 1000));
        return badRequest(
          `Vous devez attendre ${hoursRemaining}h avant de repasser cette évaluation. / You must wait ${hoursRemaining}h before retaking this assessment.`
        );
      }

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

    // Auto-enroll in any pathway that contains this assessment
    const pathwayAssessments = await prisma.pathwayAssessment.findMany({
      where: { assessmentId: id },
      select: { pathwayId: true },
    });
    for (const pa of pathwayAssessments) {
      await prisma.pathwayEnrollment.upsert({
        where: { userId_pathwayId: { userId: user.id, pathwayId: pa.pathwayId } },
        update: {},
        create: { userId: user.id, pathwayId: pa.pathwayId },
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
