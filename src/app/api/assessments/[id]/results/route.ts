import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, badRequest, serverError } from "@/lib/auth-helpers";

// GET /api/assessments/:id/results - Get assessment results
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { id } = await params;

    const menteeAssessment = await prisma.menteeAssessment.findUnique({
      where: { menteeId_assessmentId: { menteeId: user.id, assessmentId: id } },
      include: {
        assessment: true,
        answers: {
          include: {
            question: {
              include: {
                options: true,
                codingChallenge: {
                  select: {
                    testCases: true,
                    expectedComplexity: true,
                  },
                },
              },
            },
            selectedOption: true,
          },
        },
        violations: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!menteeAssessment) return notFound("Résultats non trouvés");
    if (!menteeAssessment.completedAt) return badRequest("Évaluation non terminée");

    // Build category breakdown
    const categoryBreakdown: Record<string, { score: number; maxScore: number; questions: number }> = {
      DATA_STRUCTURES: { score: 0, maxScore: 0, questions: 0 },
      ALGORITHMS: { score: 0, maxScore: 0, questions: 0 },
      OOP: { score: 0, maxScore: 0, questions: 0 },
      CRITICAL_THINKING: { score: 0, maxScore: 0, questions: 0 },
      LOGICAL_REASONING: { score: 0, maxScore: 0, questions: 0 },
    };

    const detailedAnswers = menteeAssessment.answers.map((a: any) => {
      const cat = a.question.category;
      if (categoryBreakdown[cat]) {
        categoryBreakdown[cat].score += a.pointsEarned;
        categoryBreakdown[cat].maxScore += a.question.points;
        categoryBreakdown[cat].questions++;
      }

      return {
        questionId: a.questionId,
        questionTitle: a.question.title,
        questionCategory: a.question.category,
        questionSubcategory: a.question.subcategory,
        questionType: a.question.type,
        questionDifficulty: a.question.difficulty,
        maxPoints: a.question.points,
        pointsEarned: a.pointsEarned,
        isCorrect: a.isCorrect,
        timeSpentSeconds: a.timeSpentSeconds,
        // MCQ specific — only show user's own answer, NOT the correct one (anti-cheat)
        selectedOptionText: a.selectedOption?.optionText || null,
        correctOptionText: null,
        explanation: null,
        // Coding specific
        submittedCode: a.submittedCode,
        languageUsed: a.languageUsed,
        testCasesPassed: a.testCasesPassed,
        testCasesTotal: a.testCasesTotal,
      };
    });

    const categoryBreakdownArray = Object.entries(categoryBreakdown).map(([cat, data]) => ({
      category: cat,
      score: data.score,
      maxScore: data.maxScore,
      questions: data.questions,
      percentage: data.maxScore > 0 ? Math.round((data.score / data.maxScore) * 100) : 0,
    }));

    return NextResponse.json({
      result: {
        id: menteeAssessment.id,
        assessmentTitle: menteeAssessment.assessment.title,
        totalScore: menteeAssessment.totalScore,
        maxScore: menteeAssessment.maxScore,
        percentage: menteeAssessment.percentage,
        levelAssigned: menteeAssessment.levelAssigned,
        timeTakenSeconds: menteeAssessment.timeTakenSeconds,
        violationsCount: menteeAssessment.violationsCount,
        isDisqualified: menteeAssessment.isDisqualified,
        startedAt: menteeAssessment.startedAt,
        completedAt: menteeAssessment.completedAt,
        categoryBreakdown: categoryBreakdownArray,
        answers: detailedAnswers,
        violations: menteeAssessment.violations.map((v: any) => ({
          type: v.violationType,
          timestamp: v.timestamp,
          details: v.details,
        })),
      },
    });
  } catch (error) {
    console.error("Get results error:", error);
    return serverError();
  }
}
