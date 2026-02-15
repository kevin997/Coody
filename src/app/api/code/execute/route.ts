import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized, badRequest, serverError } from "@/lib/auth-helpers";
import { executeWithTestCases, executeCode } from "@/lib/piston";

// POST /api/code/execute - Execute code against test cases
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { language, code, testCases, stdin } = body;

    if (!language || !code) {
      return badRequest("language et code sont requis");
    }

    const supportedLanguages = ["javascript", "python", "java", "cpp", "c", "typescript"];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return badRequest(`Langage non supporté. Langages disponibles: ${supportedLanguages.join(", ")}`);
    }

    // If test cases provided, run against them
    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      const result = await executeWithTestCases(
        language,
        code,
        testCases.map((tc: any) => ({
          input: tc.input || tc.stdin || "",
          expectedOutput: tc.expectedOutput || tc.expected_output || tc.expected || "",
        }))
      );

      return NextResponse.json({
        success: !result.compileError,
        results: result.results,
        totalPassed: result.totalPassed,
        totalTests: result.totalTests,
        compileError: result.compileError || null,
      });
    }

    // Simple execution (no test cases)
    const result = await executeCode(language, code, stdin || "");

    return NextResponse.json({
      success: result.exitCode === 0 && !result.compileError,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      compileError: result.compileError || null,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    const message = error instanceof Error ? error.message : "Erreur d'exécution";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
