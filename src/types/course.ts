export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  language: 'fr' | 'en';
  thumbnail?: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  type: 'markdown' | 'notebook' | 'slides' | 'exercise' | 'quiz';
  content: string; // Path to content file or actual content
  order: number;
  duration?: string;
  isOptional?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  hints?: string[];
  solution?: string;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}
