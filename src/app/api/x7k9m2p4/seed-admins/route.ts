import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SEED_SECRET = process.env.ADMIN_SEED_SECRET || "coody-seed-2026-x9k";

// POST /api/x7k9m2p4/seed-admins - Seed admin users (Postman only, requires secret)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, admins } = body;

    // Validate secret
    if (!secret || secret !== SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate payload
    if (!admins || !Array.isArray(admins) || admins.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          expected: {
            secret: "string",
            admins: [{ email: "string", name: "string", password: "string", role: "admin | instructor" }],
          },
        },
        { status: 400 }
      );
    }

    const results: { email: string; status: string }[] = [];

    for (const admin of admins) {
      const { email, name, password, role = "admin" } = admin;

      if (!email || !name || !password) {
        results.push({ email: email || "unknown", status: "skipped - missing fields" });
        continue;
      }

      if (!["admin", "instructor"].includes(role)) {
        results.push({ email, status: "skipped - invalid role (must be admin or instructor)" });
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.upsert({
        where: { email },
        update: { name, password: hashedPassword, role },
        create: { email, name, password: hashedPassword, role },
      });

      results.push({ email: user.email!, status: "created/updated" });
    }

    return NextResponse.json({
      message: `Processed ${results.length} admin(s)`,
      results,
    });
  } catch (error) {
    console.error("Seed admins error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
