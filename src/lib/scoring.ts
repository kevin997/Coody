import type { MenteeLevel, QuestionCategory } from '@/types/assessment';

// Category weights for final score calculation
const CATEGORY_WEIGHTS: Record<QuestionCategory, number> = {
  DATA_STRUCTURES: 0.20,
  ALGORITHMS: 0.25,
  OOP: 0.15,
  CRITICAL_THINKING: 0.20,
  LOGICAL_REASONING: 0.20,
};

// Level thresholds (percentage-based)
const LEVEL_THRESHOLDS: { min: number; max: number; level: MenteeLevel }[] = [
  { min: 86, max: 100, level: 'EXPERT' },
  { min: 66, max: 85, level: 'ADVANCED' },
  { min: 41, max: 65, level: 'INTERMEDIATE' },
  { min: 0, max: 40, level: 'BEGINNER' },
];

// Violation penalty: -2% per violation
const VIOLATION_PENALTY_PERCENT = 2;

interface CategoryScore {
  category: QuestionCategory;
  score: number;
  maxScore: number;
  percentage: number;
}

interface ScoringInput {
  answers: {
    questionCategory: QuestionCategory;
    pointsEarned: number;
    maxPoints: number;
  }[];
  violationsCount: number;
  isDisqualified: boolean;
}

interface ScoringResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  levelAssigned: MenteeLevel;
  categoryBreakdown: CategoryScore[];
  violationPenalty: number;
}

export function calculateScore(input: ScoringInput): ScoringResult {
  // If disqualified, return BEGINNER with 0 score
  if (input.isDisqualified) {
    const categories: QuestionCategory[] = ['DATA_STRUCTURES', 'ALGORITHMS', 'OOP'];
    return {
      totalScore: 0,
      maxScore: input.answers.reduce((sum, a) => sum + a.maxPoints, 0),
      percentage: 0,
      levelAssigned: 'BEGINNER',
      categoryBreakdown: categories.map((cat) => ({
        category: cat,
        score: 0,
        maxScore: input.answers.filter((a) => a.questionCategory === cat).reduce((s, a) => s + a.maxPoints, 0),
        percentage: 0,
      })),
      violationPenalty: 100,
    };
  }

  // Calculate per-category scores
  const categoryScores: Record<QuestionCategory, { score: number; maxScore: number }> = {
    DATA_STRUCTURES: { score: 0, maxScore: 0 },
    ALGORITHMS: { score: 0, maxScore: 0 },
    OOP: { score: 0, maxScore: 0 },
    CRITICAL_THINKING: { score: 0, maxScore: 0 },
    LOGICAL_REASONING: { score: 0, maxScore: 0 },
  };

  for (const answer of input.answers) {
    categoryScores[answer.questionCategory].score += answer.pointsEarned;
    categoryScores[answer.questionCategory].maxScore += answer.maxPoints;
  }

  // Calculate category percentages
  const categoryBreakdown: CategoryScore[] = Object.entries(categoryScores).map(([cat, scores]) => ({
    category: cat as QuestionCategory,
    score: scores.score,
    maxScore: scores.maxScore,
    percentage: scores.maxScore > 0 ? Math.round((scores.score / scores.maxScore) * 100) : 0,
  }));

  // Calculate weighted total percentage
  let weightedPercentage = 0;
  let totalWeight = 0;

  for (const breakdown of categoryBreakdown) {
    if (breakdown.maxScore > 0) {
      const weight = CATEGORY_WEIGHTS[breakdown.category];
      weightedPercentage += breakdown.percentage * weight;
      totalWeight += weight;
    }
  }

  // Normalize if not all categories are present
  if (totalWeight > 0 && totalWeight < 1) {
    weightedPercentage = weightedPercentage / totalWeight;
  }

  // Apply violation penalty
  const violationPenalty = input.violationsCount * VIOLATION_PENALTY_PERCENT;
  const finalPercentage = Math.max(0, Math.round(weightedPercentage - violationPenalty));

  // Calculate raw scores
  const totalScore = input.answers.reduce((sum, a) => sum + a.pointsEarned, 0);
  const maxScore = input.answers.reduce((sum, a) => sum + a.maxPoints, 0);

  // Assign level
  const levelAssigned = assignLevel(finalPercentage);

  return {
    totalScore,
    maxScore,
    percentage: finalPercentage,
    levelAssigned,
    categoryBreakdown,
    violationPenalty,
  };
}

export function assignLevel(percentage: number): MenteeLevel {
  for (const threshold of LEVEL_THRESHOLDS) {
    if (percentage >= threshold.min && percentage <= threshold.max) {
      return threshold.level;
    }
  }
  return 'BEGINNER';
}

export function getLevelColor(level: MenteeLevel): string {
  switch (level) {
    case 'EXPERT': return 'text-purple-600 bg-purple-100 border-purple-200';
    case 'ADVANCED': return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'INTERMEDIATE': return 'text-green-600 bg-green-100 border-green-200';
    case 'BEGINNER': return 'text-orange-600 bg-orange-100 border-orange-200';
  }
}

export function getLevelLabel(level: MenteeLevel): string {
  switch (level) {
    case 'EXPERT': return 'Expert';
    case 'ADVANCED': return 'Avancé';
    case 'INTERMEDIATE': return 'Intermédiaire';
    case 'BEGINNER': return 'Débutant';
  }
}
