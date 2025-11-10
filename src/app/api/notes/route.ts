import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Get user's notes
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
    const sectionId = searchParams.get("sectionId");

    if (courseId && sectionId) {
      // Get specific note
      const note = await prisma.courseNote.findUnique({
        where: {
          userId_courseId_sectionId: {
            userId: session.user.id,
            courseId,
            sectionId,
          },
        },
      });

      return NextResponse.json({ note });
    } else if (courseId) {
      // Get all notes for a course
      const notes = await prisma.courseNote.findMany({
        where: {
          userId: session.user.id,
          courseId,
        },
      });

      return NextResponse.json({ notes });
    } else {
      // Get all user notes
      const notes = await prisma.courseNote.findMany({
        where: {
          userId: session.user.id,
        },
      });

      return NextResponse.json({ notes });
    }
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notes" },
      { status: 500 }
    );
  }
}

// Save or update note
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
    const { courseId, sectionId, content } = body;

    if (!courseId || !sectionId || content === undefined) {
      return NextResponse.json(
        { error: "courseId, sectionId et content sont requis" },
        { status: 400 }
      );
    }

    // Upsert note
    const note = await prisma.courseNote.upsert({
      where: {
        userId_courseId_sectionId: {
          userId: session.user.id,
          courseId,
          sectionId,
        },
      },
      update: {
        content,
      },
      create: {
        userId: session.user.id,
        courseId,
        sectionId,
        content,
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error("Save note error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde de la note" },
      { status: 500 }
    );
  }
}

// Delete note
export async function DELETE(request: NextRequest) {
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
    const sectionId = searchParams.get("sectionId");

    if (!courseId || !sectionId) {
      return NextResponse.json(
        { error: "courseId et sectionId sont requis" },
        { status: 400 }
      );
    }

    await prisma.courseNote.delete({
      where: {
        userId_courseId_sectionId: {
          userId: session.user.id,
          courseId,
          sectionId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la note" },
      { status: 500 }
    );
  }
}
