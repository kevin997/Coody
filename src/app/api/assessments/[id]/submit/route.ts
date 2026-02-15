import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/auth-helpers";
import { calculateScore } from "@/lib/scoring";
import { executeWithTestCases } from "@/lib/piston";

// POST /api/assessments/:id/submit - Final submit assessment
export async function POST(
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
        answers: {
          include: {
            question: {
              include: {
                options: true,
                codingChallenge: true,
              },
            },
          },
        },
        violations: true,
      },
    });

    if (!menteeAssessment) return badRequest("Évaluation non démarrée");
    if (menteeAssessment.completedAt) return badRequest("Évaluation déjà soumise");

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { questions: { include: { codingChallenge: true } } },
    });

    if (!assessment) return badRequest("Évaluation non trouvée");

    // Calculate time taken
    const timeTakenSeconds = Math.round(
      (Date.now() - menteeAssessment.startedAt.getTime()) / 1000
    );

    // Check if disqualified
    const isDisqualified =
      menteeAssessment.violationsCount >= assessment.maxViolations;

    // Evaluate coding answers against hidden test cases
    for (const answer of menteeAssessment.answers) {
      if (
        answer.question.type === "CODING" &&
        answer.submittedCode &&
        answer.question.codingChallenge
      ) {
        try {
          const allTests = [
            ...((answer.question.codingChallenge.testCases as any[]) || []),
            ...((answer.question.codingChallenge.hiddenTestCases as any[]) || []),
          ];

          const execResult = await executeWithTestCases(
            answer.languageUsed || "javascript",
            answer.submittedCode,
            allTests.map((t: any) => ({
              input: t.input || t.stdin || "",
              expectedOutput: t.expectedOutput || t.expected_output || "",
            }))
          );

          const totalTests = allTests.length;
          const passed = execResult.totalPassed;
          const points =
            totalTests > 0
              ? (passed / totalTests) * answer.question.points
              : 0;

          await prisma.menteeAnswer.update({
            where: { id: answer.id },
            data: {
              isCorrect: passed === totalTests,
              pointsEarned: Math.round(points * 100) / 100,
              testCasesPassed: passed,
              testCasesTotal: totalTests,
            },
          });
        } catch (execError) {
          console.error(
            `Code execution failed for answer ${answer.id}:`,
            execError
          );
          await prisma.menteeAnswer.update({
            where: { id: answer.id },
            data: {
              isCorrect: false,
              pointsEarned: 0,
              testCasesPassed: 0,
              testCasesTotal: 1,
            },
          });
        }
      }
    }

    // Re-fetch updated answers
    const updatedAnswers = await prisma.menteeAnswer.findMany({
      where: { menteeAssessmentId: menteeAssessment.id },
      include: { question: true },
    });

    // Calculate final score
    const scoringResult = calculateScore({
      answers: updatedAnswers.map((a: any) => ({
        questionCategory: a.question.category as any,
        pointsEarned: a.pointsEarned,
        maxPoints: a.question.points,
      })),
      violationsCount: menteeAssessment.violationsCount,
      isDisqualified,
    });

    // Calculate max score from all questions
    const maxScore = assessment.questions.reduce((sum: number, q: any) => sum + q.points, 0);

    // Update mentee assessment
    await prisma.menteeAssessment.update({
      where: { id: menteeAssessment.id },
      data: {
        completedAt: new Date(),
        totalScore: scoringResult.totalScore,
        maxScore,
        percentage: scoringResult.percentage,
        levelAssigned: scoringResult.levelAssigned,
        timeTakenSeconds,
        isDisqualified,
      },
    });

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        level: scoringResult.levelAssigned,
        totalScore: scoringResult.totalScore,
        assessmentCompleted: true,
        assessmentCompletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        totalScore: scoringResult.totalScore,
        maxScore,
        percentage: scoringResult.percentage,
        levelAssigned: scoringResult.levelAssigned,
        timeTakenSeconds,
        violationsCount: menteeAssessment.violationsCount,
        isDisqualified,
        categoryBreakdown: scoringResult.categoryBreakdown,
        violationPenalty: scoringResult.violationPenalty,
      },
    });
  } catch (error) {
    console.error("Submit assessment error:", error);
    return serverError();
  }
}
