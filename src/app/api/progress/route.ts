import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Get user's course progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (courseId) {
      // Get specific course progress
      const progress = await prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
      });

      return NextResponse.json({ progress });
    } else {
      // Get all user progress
      const allProgress = await prisma.courseProgress.findMany({
        where: {
          userId: session.user.id,
        },
      });

      return NextResponse.json({ progress: allProgress });
    }
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la progression" },
      { status: 500 }
    );
  }
}

// Update course progress
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId, sectionId, action } = body;

    if (!courseId || !sectionId) {
      return NextResponse.json(
        { error: "courseId et sectionId sont requis" },
        { status: 400 }
      );
    }

    // Get existing progress
    const existingProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    let completedSections = existingProgress?.completedSections || [];

    // Handle different actions
    if (action === "complete" && !completedSections.includes(sectionId)) {
      completedSections = [...completedSections, sectionId];
    } else if (action === "uncomplete") {
      completedSections = completedSections.filter(id => id !== sectionId);
    }

    // Upsert progress
    const progress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      update: {
        completedSections,
        lastAccessedSection: sectionId,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        courseId,
        completedSections,
        lastAccessedSection: sectionId,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la progression" },
      { status: 500 }
    );
  }
}
