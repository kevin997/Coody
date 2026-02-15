import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/auth-helpers";

// GET /api/leaderboard - Public leaderboard
export async function GET() {
  try {
    const mentees = await prisma.user.findMany({
      where: {
        assessmentCompleted: true,
        showOnLeaderboard: true,
        level: { not: null },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        totalScore: true,
        assessmentCompletedAt: true,
        menteeAssessments: {
          where: { completedAt: { not: null } },
          select: {
            percentage: true,
            timeTakenSeconds: true,
          },
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ totalScore: "desc" }, { assessmentCompletedAt: "asc" }],
    });

    const leaderboard = mentees.map((m, index) => ({
      rank: index + 1,
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      level: m.level,
      totalScore: m.totalScore || 0,
      percentage: m.menteeAssessments[0]?.percentage || 0,
      timeTakenSeconds: m.menteeAssessments[0]?.timeTakenSeconds || 0,
      completedAt: m.assessmentCompletedAt,
    }));

    // Stats
    const stats = {
      totalAssessed: mentees.length,
      levelDistribution: {
        EXPERT: mentees.filter((m) => m.level === "EXPERT").length,
        ADVANCED: mentees.filter((m) => m.level === "ADVANCED").length,
        INTERMEDIATE: mentees.filter((m) => m.level === "INTERMEDIATE").length,
        BEGINNER: mentees.filter((m) => m.level === "BEGINNER").length,
      },
      averageScore:
        mentees.length > 0
          ? Math.round(
              mentees.reduce((sum, m) => sum + (m.totalScore || 0), 0) /
                mentees.length
            )
          : 0,
    };

    return NextResponse.json({ leaderboard, stats });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return serverError();
  }
}
