import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/auth-helpers";

// GET /api/pathways - List published pathways (public)
export async function GET() {
  try {
    const pathways = await prisma.pathway.findMany({
      where: { isActive: true, isPublished: true },
      include: {
        assessments: {
          include: {
            assessment: {
              select: {
                id: true,
                title: true,
                titleEn: true,
                description: true,
                descriptionEn: true,
                durationMinutes: true,
                _count: { select: { questions: true } },
              },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { order: "asc" },
    });

    const result = pathways.map((p) => ({
      id: p.id,
      title: p.title,
      titleEn: p.titleEn,
      subtitle: p.subtitle,
      subtitleEn: p.subtitleEn,
      description: p.description,
      descriptionEn: p.descriptionEn,
      icon: p.icon,
      color: p.color,
      image: p.image,
      level: p.level,
      duration: p.duration,
      order: p.order,
      enrollmentCount: p._count.enrollments,
      assessments: p.assessments.map((pa) => ({
        id: pa.assessment.id,
        title: pa.assessment.title,
        titleEn: pa.assessment.titleEn,
        description: pa.assessment.description,
        descriptionEn: pa.assessment.descriptionEn,
        durationMinutes: pa.assessment.durationMinutes,
        questionCount: pa.assessment._count.questions,
      })),
    }));

    return NextResponse.json({ pathways: result });
  } catch (error) {
    console.error("Get pathways error:", error);
    return serverError();
  }
}
