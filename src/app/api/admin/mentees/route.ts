import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError, isAdmin } from "@/lib/auth-helpers";

// GET /api/admin/mentees - List all mentees with assessment results
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

    const mentees = await prisma.user.findMany({
      where: {
        OR: [{ role: "mentee" }, { role: "learner" }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        level: true,
        totalScore: true,
        assessmentCompleted: true,
        assessmentCompletedAt: true,
        createdAt: true,
        menteeAssessments: {
          include: {
            assessment: { select: { title: true } },
            _count: { select: { violations: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ mentees });
  } catch (error) {
    console.error("List mentees error:", error);
    return serverError();
  }
}
