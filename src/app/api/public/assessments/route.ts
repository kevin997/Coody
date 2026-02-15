import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/auth-helpers";

// GET /api/public/assessments - List assessments (no auth required)
export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = assessments.map((a) => ({
      id: a.id,
      title: a.title,
      titleEn: a.titleEn,
      description: a.description,
      descriptionEn: a.descriptionEn,
      durationMinutes: a.durationMinutes,
      questionCount: a._count.questions,
    }));

    return NextResponse.json({ assessments: result });
  } catch (error) {
    console.error("Public get assessments error:", error);
    return serverError();
  }
}
