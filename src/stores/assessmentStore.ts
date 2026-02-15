import { create } from 'zustand';
import type { AssessmentQuestion, MenteeLevel } from '@/types/assessment';

interface AssessmentState {
  // Assessment taking state
  currentAssessmentId: string | null;
  menteeAssessmentId: string | null;
  questions: AssessmentQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, { selectedOptionId?: string; submittedCode?: string; languageUsed?: string }>;
  timeRemainingSeconds: number;
  violationsCount: number;
  isDisqualified: boolean;
  isSubmitting: boolean;

  // Actions
  setAssessment: (assessmentId: string, menteeAssessmentId: string, questions: AssessmentQuestion[], timeRemaining: number) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: { selectedOptionId?: string; submittedCode?: string; languageUsed?: string }) => void;
  setTimeRemaining: (seconds: number) => void;
  setViolationsCount: (count: number) => void;
  setIsDisqualified: (val: boolean) => void;
  setIsSubmitting: (val: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentAssessmentId: null,
  menteeAssessmentId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  timeRemainingSeconds: 0,
  violationsCount: 0,
  isDisqualified: false,
  isSubmitting: false,
};

export const useAssessmentStore = create<AssessmentState>((set) => ({
  ...initialState,

  setAssessment: (assessmentId, menteeAssessmentId, questions, timeRemaining) =>
    set({
      currentAssessmentId: assessmentId,
      menteeAssessmentId,
      questions,
      timeRemainingSeconds: timeRemaining,
      currentQuestionIndex: 0,
    }),

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  setTimeRemaining: (seconds) => set({ timeRemainingSeconds: seconds }),

  setViolationsCount: (count) => set({ violationsCount: count }),

  setIsDisqualified: (val) => set({ isDisqualified: val }),

  setIsSubmitting: (val) => set({ isSubmitting: val }),

  reset: () => set(initialState),
}));
