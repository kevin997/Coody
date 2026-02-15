const PISTON_API_URL = process.env.PISTON_API_URL || 'http://localhost:2000';

interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

interface PistonExecuteRequest {
  language: string;
  version: string;
  files: { name?: string; content: string }[];
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

interface PistonExecuteResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  language: string;
  version: string;
}

// Map friendly language names to Piston language identifiers
const LANGUAGE_MAP: Record<string, { language: string; version: string; extension: string }> = {
  javascript: { language: 'javascript', version: '20.11.1', extension: 'js' },
  python: { language: 'python', version: '3.12.0', extension: 'py' },
  java: { language: 'java', version: '15.0.2', extension: 'java' },
  cpp: { language: 'c++', version: '10.2.0', extension: 'cpp' },
  c: { language: 'c', version: '10.2.0', extension: 'c' },
  typescript: { language: 'typescript', version: '5.0.3', extension: 'ts' },
};

let cachedRuntimes: PistonRuntime[] | null = null;

export async function getRuntimes(): Promise<PistonRuntime[]> {
  if (cachedRuntimes) return cachedRuntimes;

  const res = await fetch(`${PISTON_API_URL}/api/v2/runtimes`);
  if (!res.ok) throw new Error(`Piston API error: ${res.statusText}`);
  cachedRuntimes = await res.json();
  return cachedRuntimes!;
}

function resolveLanguage(lang: string): { language: string; version: string } {
  const mapping = LANGUAGE_MAP[lang.toLowerCase()];
  if (!mapping) throw new Error(`Unsupported language: ${lang}. Supported: ${Object.keys(LANGUAGE_MAP).join(', ')}`);
  return { language: mapping.language, version: mapping.version };
}

export async function executeCode(
  language: string,
  code: string,
  stdin?: string
): Promise<{ stdout: string; stderr: string; exitCode: number; compileError?: string }> {
  const { language: pistonLang, version } = resolveLanguage(language);
  const mapping = LANGUAGE_MAP[language.toLowerCase()] || { extension: 'txt' };

  const body: PistonExecuteRequest = {
    language: pistonLang,
    version,
    files: [{ name: `main.${mapping.extension}`, content: code }],
    stdin: stdin || '',
    run_timeout: 10000,
    compile_timeout: 30000,
    run_memory_limit: 256 * 1024 * 1024, // 256MB
  };

  const res = await fetch(`${PISTON_API_URL}/api/v2/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Piston execution error: ${text}`);
  }

  const result: PistonExecuteResponse = await res.json();

  // Check for compile errors
  if (result.compile && result.compile.code !== 0) {
    return {
      stdout: '',
      stderr: result.compile.stderr || result.compile.output,
      exitCode: result.compile.code,
      compileError: result.compile.stderr || result.compile.output,
    };
  }

  return {
    stdout: result.run.stdout.trim(),
    stderr: result.run.stderr.trim(),
    exitCode: result.run.code,
  };
}

export interface TestCaseResult {
  testCase: number;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTimeMs: number;
  error?: string;
}

export async function executeWithTestCases(
  language: string,
  code: string,
  testCases: { input: string; expectedOutput: string }[]
): Promise<{
  results: TestCaseResult[];
  totalPassed: number;
  totalTests: number;
  compileError?: string;
}> {
  const results: TestCaseResult[] = [];
  let totalPassed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const startTime = Date.now();

    try {
      const execResult = await executeCode(language, code, tc.input);
      const executionTimeMs = Date.now() - startTime;

      if (execResult.compileError) {
        return {
          results: [],
          totalPassed: 0,
          totalTests: testCases.length,
          compileError: execResult.compileError,
        };
      }

      const actual = execResult.stdout.trim();
      const expected = tc.expectedOutput.trim();
      const passed = actual === expected;

      if (passed) totalPassed++;

      results.push({
        testCase: i + 1,
        passed,
        input: tc.input,
        expected,
        actual,
        executionTimeMs,
        error: execResult.stderr || undefined,
      });
    } catch (error) {
      results.push({
        testCase: i + 1,
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput.trim(),
        actual: '',
        executionTimeMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Execution failed',
      });
    }
  }

  return {
    results,
    totalPassed,
    totalTests: testCases.length,
  };
}

export async function installRuntime(language: string, version: string): Promise<void> {
  const res = await fetch(`${PISTON_API_URL}/api/v2/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, version }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to install runtime: ${text}`);
  }
}
