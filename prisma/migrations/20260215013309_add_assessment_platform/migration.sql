/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('learner', 'instructor', 'mentee', 'admin');

-- CreateEnum
CREATE TYPE "MenteeLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('DATA_STRUCTURES', 'ALGORITHMS', 'OOP');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'CODING');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ViolationType" AS ENUM ('TAB_SWITCH', 'COPY_PASTE', 'RIGHT_CLICK', 'DEV_TOOLS', 'WINDOW_BLUR', 'FULLSCREEN_EXIT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "assessmentCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "assessmentCompletedAt" TIMESTAMP(3),
ADD COLUMN     "level" "MenteeLevel",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "showOnLeaderboard" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "totalScore" DOUBLE PRECISION,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'learner';

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 120,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxViolations" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "subcategory" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeLimitSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multiple_choice_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "multiple_choice_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_challenges" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "starterCode" JSONB NOT NULL,
    "solutionCode" JSONB NOT NULL,
    "testCases" JSONB NOT NULL,
    "hiddenTestCases" JSONB NOT NULL,
    "hints" JSONB,
    "constraints" TEXT,
    "expectedComplexity" JSONB,

    CONSTRAINT "coding_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentee_assessments" (
    "id" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalScore" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "percentage" DOUBLE PRECISION,
    "levelAssigned" "MenteeLevel",
    "timeTakenSeconds" INTEGER,
    "violationsCount" INTEGER NOT NULL DEFAULT 0,
    "isDisqualified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentee_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentee_answers" (
    "id" TEXT NOT NULL,
    "menteeAssessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "submittedCode" TEXT,
    "languageUsed" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "pointsEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "attemptsCount" INTEGER NOT NULL DEFAULT 1,
    "testCasesPassed" INTEGER NOT NULL DEFAULT 0,
    "testCasesTotal" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentee_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "violation_logs" (
    "id" TEXT NOT NULL,
    "menteeAssessmentId" TEXT NOT NULL,
    "violationType" "ViolationType" NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "violation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coding_challenges_questionId_key" ON "coding_challenges"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "mentee_assessments_menteeId_assessmentId_key" ON "mentee_assessments"("menteeId", "assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "mentee_answers_menteeAssessmentId_questionId_key" ON "mentee_answers"("menteeAssessmentId", "questionId");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multiple_choice_options" ADD CONSTRAINT "multiple_choice_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_challenges" ADD CONSTRAINT "coding_challenges_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_assessments" ADD CONSTRAINT "mentee_assessments_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_assessments" ADD CONSTRAINT "mentee_assessments_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_answers" ADD CONSTRAINT "mentee_answers_menteeAssessmentId_fkey" FOREIGN KEY ("menteeAssessmentId") REFERENCES "mentee_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_answers" ADD CONSTRAINT "mentee_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentee_answers" ADD CONSTRAINT "mentee_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "multiple_choice_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violation_logs" ADD CONSTRAINT "violation_logs_menteeAssessmentId_fkey" FOREIGN KEY ("menteeAssessmentId") REFERENCES "mentee_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
