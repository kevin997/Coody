import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/auth-helpers";

// POST /api/assessments/:id/violations - Log a violation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { type, details } = body;

    if (!type) return badRequest("Type de violation requis");

    const validTypes = [
      "TAB_SWITCH",
      "COPY_PASTE",
      "RIGHT_CLICK",
      "DEV_TOOLS",
      "WINDOW_BLUR",
      "FULLSCREEN_EXIT",
    ];
    if (!validTypes.includes(type)) return badRequest("Type de violation invalide");

    const menteeAssessment = await prisma.menteeAssessment.findUnique({
      where: { menteeId_assessmentId: { menteeId: user.id, assessmentId: id } },
      include: { assessment: true },
    });

    if (!menteeAssessment) return badRequest("Évaluation non démarrée");
    if (menteeAssessment.completedAt) return badRequest("Évaluation déjà terminée");

    // Log the violation
    await prisma.violationLog.create({
      data: {
        menteeAssessmentId: menteeAssessment.id,
        violationType: type,
        details: details || {},
      },
    });

    // Increment violation count
    const updated = await prisma.menteeAssessment.update({
      where: { id: menteeAssessment.id },
      data: { violationsCount: { increment: 1 } },
    });

    // Check for disqualification
    const maxViolations = menteeAssessment.assessment.maxViolations;
    const isDisqualified = updated.violationsCount >= maxViolations;

    if (isDisqualified) {
      await prisma.menteeAssessment.update({
        where: { id: menteeAssessment.id },
        data: { isDisqualified: true },
      });
    }

    return NextResponse.json({
      success: true,
      violationsCount: updated.violationsCount,
      maxViolations,
      isDisqualified,
      warning:
        updated.violationsCount >= maxViolations - 1 && !isDisqualified
          ? "Attention: encore une violation et vous serez disqualifié"
          : null,
    });
  } catch (error) {
    console.error("Log violation error:", error);
    return serverError();
  }
}
