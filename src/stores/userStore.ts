import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CourseProgress {
  courseId: string;
  completedSections: string[];
  currentSection: string;
  lastAccessed: string;
  notes: Record<string, string>;
  exerciseResults: Record<string, { completed: boolean; score?: number; attempts: number }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'instructor';
  avatar?: string;
}

interface UserState {
  user: User | null;
  courseProgress: Record<string, CourseProgress>;
  setUser: (user: User | null) => void;
  updateCourseProgress: (courseId: string, progress: Partial<CourseProgress>) => void;
  markSectionComplete: (courseId: string, sectionId: string) => void;
  saveNote: (courseId: string, sectionId: string, note: string) => void;
  updateExerciseResult: (courseId: string, exerciseId: string, result: { completed: boolean; score?: number }) => void;
  resetProgress: (courseId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      courseProgress: {},
      
      setUser: (user) => set({ user }),
      
      updateCourseProgress: (courseId, progress) => {
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...state.courseProgress[courseId],
              ...progress,
              lastAccessed: new Date().toISOString(),
            },
          },
        }));
      },
      
      markSectionComplete: (courseId, sectionId) => {
        const currentProgress = get().courseProgress[courseId];
        const completedSections = currentProgress?.completedSections || [];
        
        if (!completedSections.includes(sectionId)) {
          set((state) => ({
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...currentProgress,
                completedSections: [...completedSections, sectionId],
                lastAccessed: new Date().toISOString(),
              },
            },
          }));
        }
      },
      
      saveNote: (courseId, sectionId, note) => {
        const currentProgress = get().courseProgress[courseId];
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...currentProgress,
              notes: {
                ...currentProgress?.notes,
                [sectionId]: note,
              },
              lastAccessed: new Date().toISOString(),
            },
          },
        }));
      },
      
      updateExerciseResult: (courseId, exerciseId, result) => {
        const currentProgress = get().courseProgress[courseId];
        const existingResult = currentProgress?.exerciseResults?.[exerciseId];
        
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...currentProgress,
              exerciseResults: {
                ...currentProgress?.exerciseResults,
                [exerciseId]: {
                  ...result,
                  attempts: (existingResult?.attempts || 0) + 1,
                },
              },
              lastAccessed: new Date().toISOString(),
            },
          },
        }));
      },
      
      resetProgress: (courseId) => {
        set((state) => {
          const newProgress = { ...state.courseProgress };
          delete newProgress[courseId];
          return { courseProgress: newProgress };
        });
      },
    }),
    {
      name: 'coody-user-storage',
    }
  )
);
