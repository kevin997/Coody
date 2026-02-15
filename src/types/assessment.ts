export type QuestionCategory = 'DATA_STRUCTURES' | 'ALGORITHMS' | 'OOP' | 'CRITICAL_THINKING' | 'LOGICAL_REASONING';
export type QuestionType = 'MULTIPLE_CHOICE' | 'CODING';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type MenteeLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ViolationType = 'TAB_SWITCH' | 'COPY_PASTE' | 'RIGHT_CLICK' | 'DEV_TOOLS' | 'WINDOW_BLUR' | 'FULLSCREEN_EXIT';

export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  points?: number;
}

export interface StarterCode {
  javascript?: string;
  python?: string;
  java?: string;
  cpp?: string;
}

export interface ExpectedComplexity {
  time: string;
  space: string;
}

export interface AssessmentQuestion {
  id: string;
  category: QuestionCategory;
  subcategory: string;
  type: QuestionType;
  difficulty: Difficulty;
  points: number;
  title: string;
  description: string;
  timeLimitSeconds?: number;
  options?: {
    id: string;
    optionText: string;
    order: number;
  }[];
  codingChallenge?: {
    id: string;
    starterCode: StarterCode;
    testCases: TestCase[];
    hints?: string[];
    constraints?: string;
    expectedComplexity?: ExpectedComplexity;
  };
}

export interface AssessmentData {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  isActive: boolean;
  questionCount?: number;
}

export interface MenteeAssessmentResult {
  id: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  levelAssigned: MenteeLevel;
  timeTakenSeconds: number;
  violationsCount: number;
  isDisqualified: boolean;
  completedAt: string;
  categoryBreakdown: {
    category: QuestionCategory;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
}

export interface CodeExecutionRequest {
  language: string;
  code: string;
  testCases: TestCase[];
}

export interface CodeExecutionResult {
  testCase: number;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTimeMs: number;
  memoryKb?: number;
  error?: string;
}

export interface CodeExecutionResponse {
  success: boolean;
  results: CodeExecutionResult[];
  totalPassed: number;
  totalTests: number;
  compileError?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  level: MenteeLevel;
  totalScore: number;
  percentage: number;
  completedAt: string;
}
