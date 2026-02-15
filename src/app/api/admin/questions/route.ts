import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, badRequest, serverError, isAdmin } from "@/lib/auth-helpers";

// GET /api/admin/questions - List all questions
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessmentId");
    const category = searchParams.get("category");

    const where: any = {};
    if (assessmentId) where.assessmentId = assessmentId;
    if (category) where.category = category;

    const questions = await prisma.question.findMany({
      where,
      include: {
        options: { orderBy: { order: "asc" } },
        codingChallenge: true,
        _count: { select: { menteeAnswers: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("List questions error:", error);
    return serverError();
  }
}

// POST /api/admin/questions - Create a question
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

    const body = await request.json();
    const {
      assessmentId,
      category,
      subcategory,
      type,
      difficulty,
      points = 10,
      title,
      description,
      timeLimitSeconds,
      options,
      codingChallenge,
    } = body;

    if (!assessmentId || !category || !subcategory || !type || !difficulty || !title || !description) {
      return badRequest("Tous les champs obligatoires sont requis");
    }

    const question = await prisma.question.create({
      data: {
        assessmentId,
        category,
        subcategory,
        type,
        difficulty,
        points,
        title,
        description,
        timeLimitSeconds,
        ...(type === "MULTIPLE_CHOICE" && options
          ? {
              options: {
                create: options.map((opt: any, i: number) => ({
                  optionText: opt.optionText,
                  isCorrect: opt.isCorrect || false,
                  explanation: opt.explanation || null,
                  order: opt.order ?? i,
                })),
              },
            }
          : {}),
        ...(type === "CODING" && codingChallenge
          ? {
              codingChallenge: {
                create: {
                  starterCode: codingChallenge.starterCode || {},
                  solutionCode: codingChallenge.solutionCode || {},
                  testCases: codingChallenge.testCases || [],
                  hiddenTestCases: codingChallenge.hiddenTestCases || [],
                  hints: codingChallenge.hints || [],
                  constraints: codingChallenge.constraints || null,
                  expectedComplexity: codingChallenge.expectedComplexity || null,
                },
              },
            }
          : {}),
      },
      include: {
        options: true,
        codingChallenge: true,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Create question error:", error);
    return serverError();
  }
}
