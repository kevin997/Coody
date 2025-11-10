import { create } from 'zustand';
import type { Course, Module, Section } from '@/types/course';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  currentModule: Module | null;
  currentSection: Section | null;
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentModule: (module: Module | null) => void;
  setCurrentSection: (section: Section | null) => void;
  navigateToSection: (courseId: string, moduleId: string, sectionId: string) => void;
  getNextSection: () => Section | null;
  getPreviousSection: () => Section | null;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  currentModule: null,
  currentSection: null,
  
  setCourses: (courses) => set({ courses }),
  
  setCurrentCourse: (course) => set({ 
    currentCourse: course,
    currentModule: course?.modules[0] || null,
    currentSection: course?.modules[0]?.sections[0] || null,
  }),
  
  setCurrentModule: (module) => set({ 
    currentModule: module,
    currentSection: module?.sections[0] || null,
  }),
  
  setCurrentSection: (section) => set({ currentSection: section }),
  
  navigateToSection: (courseId, moduleId, sectionId) => {
    const { courses } = get();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const section = module.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    set({
      currentCourse: course,
      currentModule: module,
      currentSection: section,
    });
  },
  
  getNextSection: () => {
    const { currentCourse, currentModule, currentSection } = get();
    if (!currentCourse || !currentModule || !currentSection) return null;
    
    const currentSectionIndex = currentModule.sections.findIndex(
      s => s.id === currentSection.id
    );
    
    // Check if there's a next section in current module
    if (currentSectionIndex < currentModule.sections.length - 1) {
      return currentModule.sections[currentSectionIndex + 1];
    }
    
    // Check if there's a next module
    const currentModuleIndex = currentCourse.modules.findIndex(
      m => m.id === currentModule.id
    );
    
    if (currentModuleIndex < currentCourse.modules.length - 1) {
      const nextModule = currentCourse.modules[currentModuleIndex + 1];
      return nextModule.sections[0] || null;
    }
    
    return null;
  },
  
  getPreviousSection: () => {
    const { currentCourse, currentModule, currentSection } = get();
    if (!currentCourse || !currentModule || !currentSection) return null;
    
    const currentSectionIndex = currentModule.sections.findIndex(
      s => s.id === currentSection.id
    );
    
    // Check if there's a previous section in current module
    if (currentSectionIndex > 0) {
      return currentModule.sections[currentSectionIndex - 1];
    }
    
    // Check if there's a previous module
    const currentModuleIndex = currentCourse.modules.findIndex(
      m => m.id === currentModule.id
    );
    
    if (currentModuleIndex > 0) {
      const previousModule = currentCourse.modules[currentModuleIndex - 1];
      return previousModule.sections[previousModule.sections.length - 1] || null;
    }
    
    return null;
  },
}));
