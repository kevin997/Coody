import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/auth-helpers";

// POST /api/assessments/:id/answer - Submit an answer for a question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const { questionId, selectedOptionId, submittedCode, languageUsed, timeSpentSeconds = 0 } = body;

    if (!questionId) return badRequest("questionId est requis");

    // Verify mentee assessment exists and is active
    const menteeAssessment = await prisma.menteeAssessment.findUnique({
      where: { menteeId_assessmentId: { menteeId: user.id, assessmentId: id } },
    });

    if (!menteeAssessment) return badRequest("Évaluation non démarrée");
    if (menteeAssessment.completedAt) return badRequest("Évaluation déjà terminée");
    if (menteeAssessment.isDisqualified) return badRequest("Vous avez été disqualifié");

    // Check time limit
    const assessment = await prisma.assessment.findUnique({ where: { id } });
    if (!assessment) return badRequest("Évaluation non trouvée");

    const elapsed = (Date.now() - menteeAssessment.startedAt.getTime()) / 1000;
    if (elapsed > assessment.durationMinutes * 60) {
      return badRequest("Le temps imparti est écoulé");
    }

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
        codingChallenge: true,
      },
    });

    if (!question || question.assessmentId !== id) {
      return badRequest("Question non trouvée dans cette évaluation");
    }

    let isCorrect = false;
    let pointsEarned = 0;
    let testCasesPassed = 0;
    let testCasesTotal = 0;

    if (question.type === "MULTIPLE_CHOICE") {
      if (!selectedOptionId) return badRequest("Veuillez sélectionner une option");

      const selectedOption = question.options.find((o: any) => o.id === selectedOptionId);
      if (!selectedOption) return badRequest("Option invalide");

      isCorrect = selectedOption.isCorrect;
      pointsEarned = isCorrect ? question.points : 0;
    } else if (question.type === "CODING") {
      if (!submittedCode) return badRequest("Veuillez soumettre votre code");

      // For coding questions, we evaluate against visible test cases only
      // Hidden test cases are checked on final submit
      if (question.codingChallenge) {
        const visibleTests = question.codingChallenge.testCases as any[];
        testCasesTotal = visibleTests.length;

        // The actual code execution happens via /api/code/execute
        // Here we just record the submission
        // Points will be calculated on final assessment submit
        pointsEarned = 0; // Placeholder - calculated on submit
      }
    }

    // Upsert the answer (allow updating before final submit)
    const answer = await prisma.menteeAnswer.upsert({
      where: {
        menteeAssessmentId_questionId: {
          menteeAssessmentId: menteeAssessment.id,
          questionId,
        },
      },
      update: {
        selectedOptionId: question.type === "MULTIPLE_CHOICE" ? selectedOptionId : null,
        submittedCode: question.type === "CODING" ? submittedCode : null,
        languageUsed: question.type === "CODING" ? languageUsed : null,
        isCorrect,
        pointsEarned,
        timeSpentSeconds,
        testCasesPassed,
        testCasesTotal,
        attemptsCount: { increment: 1 },
        submittedAt: new Date(),
      },
      create: {
        menteeAssessmentId: menteeAssessment.id,
        questionId,
        selectedOptionId: question.type === "MULTIPLE_CHOICE" ? selectedOptionId : null,
        submittedCode: question.type === "CODING" ? submittedCode : null,
        languageUsed: question.type === "CODING" ? languageUsed : null,
        isCorrect,
        pointsEarned,
        timeSpentSeconds,
        testCasesPassed,
        testCasesTotal,
      },
    });

    // For MCQ, return whether the answer was correct (instant feedback)
    const response: any = {
      success: true,
      answerId: answer.id,
      questionType: question.type,
    };

    if (question.type === "MULTIPLE_CHOICE") {
      response.isCorrect = isCorrect;
      response.pointsEarned = pointsEarned;
      // Find the correct option to show explanation
      const correctOption = question.options.find((o: any) => o.isCorrect);
      response.correctOptionId = correctOption?.id;
      response.explanation = correctOption?.explanation;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Submit answer error:", error);
    return serverError();
  }
}
