import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, badRequest, serverError } from "@/lib/auth-helpers";

// GET /api/assessments/:id/questions - Get questions for an assessment (must be started)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;

    // Check that the mentee has started this assessment
    const menteeAssessment = await prisma.menteeAssessment.findUnique({
      where: { menteeId_assessmentId: { menteeId: user.id, assessmentId: id } },
    });

    if (!menteeAssessment) {
      return badRequest("Vous devez d'abord démarrer l'évaluation");
    }

    if (menteeAssessment.completedAt) {
      return badRequest("Cette évaluation est déjà terminée");
    }

    // Check time limit
    const assessment = await prisma.assessment.findUnique({ where: { id } });
    if (!assessment) return notFound("Évaluation non trouvée");

    const elapsed = (Date.now() - menteeAssessment.startedAt.getTime()) / 1000;
    const timeLimit = assessment.durationMinutes * 60;
    if (elapsed > timeLimit) {
      return badRequest("Le temps imparti est écoulé");
    }

    // Get questions with options (no correct answers) and coding challenges (no solutions)
    const questions = await prisma.question.findMany({
      where: { assessmentId: id },
      include: {
        options: {
          select: {
            id: true,
            optionText: true,
            order: true,
            // NOT including isCorrect or explanation
          },
          orderBy: { order: "asc" },
        },
        codingChallenge: {
          select: {
            id: true,
            starterCode: true,
            testCases: true,
            // NOT including hiddenTestCases or solutionCode
            hints: true,
            constraints: true,
            expectedComplexity: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Shuffle questions for randomization (seeded by menteeAssessment id for consistency)
    const shuffled = shuffleWithSeed(questions, menteeAssessment.id);

    // Get already submitted answers
    const answers = await prisma.menteeAnswer.findMany({
      where: { menteeAssessmentId: menteeAssessment.id },
      select: { questionId: true, selectedOptionId: true, submittedCode: true, languageUsed: true },
    });

    const answeredMap = new Map(answers.map((a) => [a.questionId, a]));

    const result = shuffled.map((q, index) => ({
      ...q,
      order: index + 1,
      answered: answeredMap.has(q.id),
      previousAnswer: answeredMap.get(q.id) || null,
    }));

    return NextResponse.json({
      questions: result,
      totalQuestions: result.length,
      answeredCount: answers.length,
      timeRemainingSeconds: Math.max(0, Math.round(timeLimit - elapsed)),
      menteeAssessmentId: menteeAssessment.id,
    });
  } catch (error) {
    console.error("Get questions error:", error);
    return serverError();
  }
}

// Simple seeded shuffle for consistent question order per mentee
function shuffleWithSeed<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
