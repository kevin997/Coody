import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/auth-helpers";

// GET /api/pathways/enrolled - Get user's enrolled pathways
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const enrollments = await prisma.pathwayEnrollment.findMany({
      where: { userId: user.id },
      include: {
        pathway: {
          include: {
            assessments: {
              include: {
                assessment: {
                  select: {
                    id: true,
                    title: true,
                    titleEn: true,
                    durationMinutes: true,
                    _count: { select: { questions: true } },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Get user's assessment completions
    const menteeAssessments = await prisma.menteeAssessment.findMany({
      where: { menteeId: user.id },
      select: { assessmentId: true, completedAt: true, percentage: true, levelAssigned: true },
    });
    const completionMap = new Map(
      menteeAssessments.map((ma: any) => [ma.assessmentId, ma])
    );

    const result = enrollments.map((e: any) => ({
      id: e.id,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      pathway: {
        id: e.pathway.id,
        title: e.pathway.title,
        titleEn: e.pathway.titleEn,
        subtitle: e.pathway.subtitle,
        subtitleEn: e.pathway.subtitleEn,
        description: e.pathway.description,
        descriptionEn: e.pathway.descriptionEn,
        icon: e.pathway.icon,
        color: e.pathway.color,
        level: e.pathway.level,
        duration: e.pathway.duration,
        assessments: e.pathway.assessments.map((pa: any) => {
          const completion: any = completionMap.get(pa.assessment.id);
          return {
            id: pa.assessment.id,
            title: pa.assessment.title,
            titleEn: pa.assessment.titleEn,
            durationMinutes: pa.assessment.durationMinutes,
            questionCount: pa.assessment._count.questions,
            isCompleted: !!completion?.completedAt,
            percentage: completion?.percentage || null,
            levelAssigned: completion?.levelAssigned || null,
          };
        }),
      },
    }));

    return NextResponse.json({ enrollments: result });
  } catch (error) {
    console.error("Get enrolled pathways error:", error);
    return serverError();
  }
}
