import type { Course, Module, Section } from '@/types/course';

// This will load course data from the python-sql-finance folder
// In production, this would fetch from an API or database
export function loadPythonFinanceCourse(): Course {
  return {
    id: 'python-sql-finance',
    title: 'Formation Python & SQL pour la Finance',
    description: 'Programme complet pour débutants - Maîtriser Python et SQL pour l\'analyse financière',
    instructor: 'Instructeur Coody',
    duration: '10-12 semaines',
    level: 'débutant',
    language: 'fr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [
      {
        id: 'module-1',
        title: 'Fondations Python',
        description: 'Semaines 1-4 : Les bases de la programmation Python',
        order: 1,
        duration: '4 semaines',
        sections: [
          {
            id: 'section-1-1',
            title: 'Introduction et Premiers Pas',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#partie-2--fondamentaux-python',
            order: 1,
            duration: '2h',
          },
          {
            id: 'section-1-2',
            title: 'Notebook - Séance 1: Introduction',
            type: 'notebook',
            content: '/python-sql-finance/notebook-seance-01-introduction.ipynb',
            order: 2,
            duration: '1h30',
          },
          {
            id: 'section-1-3',
            title: 'Structures conditionnelles',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#chapitre-2--structures-conditionnelles',
            order: 3,
            duration: '1h30',
          },
          {
            id: 'section-1-4',
            title: 'Boucles',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#chapitre-3--boucles',
            order: 4,
            duration: '2h',
          },
          {
            id: 'section-1-5',
            title: 'Notebook - Séances 4-5: Boucles',
            type: 'notebook',
            content: '/python-sql-finance/notebook-seances-04-05-boucles-finance.ipynb',
            order: 5,
            duration: '2h',
          },
        ],
      },
      {
        id: 'module-2',
        title: 'Bibliothèques Essentielles',
        description: 'Semaines 5-6 : NumPy, Pandas et Matplotlib',
        order: 2,
        duration: '2 semaines',
        sections: [
          {
            id: 'section-2-1',
            title: 'Introduction à NumPy',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#module-2--bibliothèques-essentielles',
            order: 1,
            duration: '1h30',
          },
          {
            id: 'section-2-2',
            title: 'Pandas pour la manipulation de données',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#module-2--bibliothèques-essentielles',
            order: 2,
            duration: '2h',
          },
        ],
      },
      {
        id: 'module-3',
        title: 'SQL et Bases de Données',
        description: 'Semaines 7-8 : Gestion de données avec SQL',
        order: 3,
        duration: '2 semaines',
        sections: [
          {
            id: 'section-3-1',
            title: 'Fondamentaux SQL',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#module-3--sql-et-bases-de-données',
            order: 1,
            duration: '2h',
          },
        ],
      },
      {
        id: 'module-4',
        title: 'Applications Financières',
        description: 'Semaines 9-12 : Projets pratiques en finance',
        order: 4,
        duration: '4 semaines',
        sections: [
          {
            id: 'section-4-1',
            title: 'Analyse de données boursières',
            type: 'markdown',
            content: '/python-sql-finance/formation-python-sql-finance.md#module-4--applications-financières',
            order: 1,
            duration: '2h',
          },
        ],
      },
    ],
  };
}

export function loadAllCourses(): Course[] {
  return [loadPythonFinanceCourse()];
}

export function getCourseById(id: string): Course | null {
  const courses = loadAllCourses();
  return courses.find(c => c.id === id) || null;
}
