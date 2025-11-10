'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCourseById } from '@/lib/courseLoader';
import type { Course, Module, Section } from '@/types/course';
import { CourseNavigation } from '@/components/CourseNavigation';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { NotebookViewer } from '@/components/NotebookViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Save,
  FileText,
  Code,
  Presentation
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [markdownContent, setMarkdownContent] = useState('');
  const [notebookData, setNotebookData] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load course and progress
  useEffect(() => {
    const loadedCourse = getCourseById(courseId);
    if (!loadedCourse) {
      router.push('/');
      return;
    }
    setCourse(loadedCourse);

    // Get section from URL or use first section
    const sectionParam = searchParams.get('section');
    if (sectionParam) {
      // Find module and section
      for (const module of loadedCourse.modules) {
        const section = module.sections.find(s => s.id === sectionParam);
        if (section) {
          setCurrentModuleId(module.id);
          setCurrentSectionId(section.id);
          break;
        }
      }
    } else if (loadedCourse.modules[0]?.sections[0]) {
      // Default to first section
      setCurrentModuleId(loadedCourse.modules[0].id);
      setCurrentSectionId(loadedCourse.modules[0].sections[0].id);
      router.replace(`/cours/${courseId}?section=${loadedCourse.modules[0].sections[0].id}`);
    }

    // Load progress from database if logged in
    if (session?.user) {
      fetch(`/api/progress?courseId=${courseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.progress) {
            setCompletedSections(data.progress.completedSections || []);
          }
        })
        .catch(err => console.error('Failed to load progress:', err));
    }
  }, [courseId, router, searchParams, session]);

  // Helper: Get current section object
  const currentSection = course && currentSectionId && currentModuleId
    ? course.modules
        .find(m => m.id === currentModuleId)
        ?.sections.find(s => s.id === currentSectionId)
    : null;

  // Load section content when section changes
  useEffect(() => {
    if (!currentSection) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Load notes from database if logged in
    if (session?.user) {
      fetch(`/api/notes?courseId=${courseId}&sectionId=${currentSection.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.note) {
            setNotes(data.note.content || '');
          } else {
            setNotes('');
          }
        })
        .catch(() => setNotes(''));

      // Update last accessed section
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          sectionId: currentSection.id,
          action: 'access',
        }),
      }).catch(err => console.error('Failed to update access:', err));
    }

    // Load content based on type
    if (currentSection.type === 'markdown' || currentSection.type === 'slides') {
      fetch(`/api/content${currentSection.content}`)
        .then(res => res.ok ? res.text() : Promise.reject())
        .then(content => {
          setMarkdownContent(content);
          setIsLoading(false);
        })
        .catch(() => {
          setMarkdownContent(`# ${currentSection.title}\n\n⚠️ Contenu à charger depuis \`${currentSection.content}\``);
          setIsLoading(false);
        });
    } else if (currentSection.type === 'notebook') {
      fetch(`/api/content${currentSection.content}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setNotebookData(data);
          setIsLoading(false);
        })
        .catch(() => {
          setNotebookData(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [currentSection, courseId, session]);

  // Navigation handlers
  const handleSectionSelect = (moduleId: string, sectionId: string) => {
    router.push(`/cours/${courseId}?section=${sectionId}`);
  };

  const handleCompleteSection = async () => {
    if (!currentSection || !session?.user) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          sectionId: currentSection.id,
          action: 'complete',
        }),
      });
      
      if (response.ok) {
        setCompletedSections(prev => [...prev, currentSection.id]);
      }
    } catch (error) {
      console.error('Failed to mark complete:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!currentSection || !session?.user) return;
    
    setIsSaving(true);
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          sectionId: currentSection.id,
          content: notes,
        }),
      });
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get next section
  const getNextSection = () => {
    if (!course || !currentSectionId) return null;
    
    const allSections: Array<{ module: Module; section: Section }> = [];
    course.modules.forEach(module => {
      module.sections.forEach(section => {
        allSections.push({ module, section });
      });
    });
    
    const currentIndex = allSections.findIndex(item => item.section.id === currentSectionId);
    return allSections[currentIndex + 1] || null;
  };

  // Get previous section  
  const getPreviousSection = () => {
    if (!course || !currentSectionId) return null;
    
    const allSections: Array<{ module: Module; section: Section }> = [];
    course.modules.forEach(module => {
      module.sections.forEach(section => {
        allSections.push({ module, section });
      });
    });
    
    const currentIndex = allSections.findIndex(item => item.section.id === currentSectionId);
    return allSections[currentIndex - 1] || null;
  };

  const handleNext = () => {
    const next = getNextSection();
    if (next) {
      router.push(`/cours/${courseId}?section=${next.section.id}`);
    }
  };

  const handlePrevious = () => {
    const previous = getPreviousSection();
    if (previous) {
      router.push(`/cours/${courseId}?section=${previous.section.id}`);
    }
  };

  const isCompleted = currentSection && completedSections.includes(currentSection.id);

  if (!course) {
    return <div className="container py-8">Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 border-r bg-background">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
          <CourseNavigation 
            course={course}
            currentSectionId={currentSectionId}
            completedSections={completedSections}
            onSectionSelect={handleSectionSelect}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container max-w-5xl py-8 px-4">
          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Navigation du cours
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="h-full overflow-y-auto p-4">
                  <CourseNavigation 
                    course={course}
                    currentSectionId={currentSectionId}
                    completedSections={completedSections}
                    onSectionSelect={handleSectionSelect}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {currentSection && (
            <>
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    {currentSection.type === 'markdown' && <FileText className="mr-1 h-3 w-3" />}
                    {currentSection.type === 'notebook' && <Code className="mr-1 h-3 w-3" />}
                    {currentSection.type === 'slides' && <Presentation className="mr-1 h-3 w-3" />}
                    {currentSection.type}
                  </Badge>
                  {currentSection.duration && (
                    <Badge variant="secondary">{currentSection.duration}</Badge>
                  )}
                  {isCompleted && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Complété
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{currentSection.title}</h1>
              </div>

              {/* Content */}
              {isLoading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    Chargement du contenu...
                  </CardContent>
                </Card>
              ) : (
                <>
                  {(currentSection.type === 'markdown' || currentSection.type === 'slides') && (
                    <MarkdownRenderer content={markdownContent} />
                  )}
                  
                  {currentSection.type === 'notebook' && notebookData && (
                    <NotebookViewer notebook={notebookData} />
                  )}
                </>
              )}

              {/* Notes Section */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Mes Notes</h3>
                    <Button size="sm" onClick={handleSaveNote}>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Prenez des notes sur cette section..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Separator className="my-8" />

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={!getPreviousSection()}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>

                <Button
                  variant={isCompleted ? "outline" : "default"}
                  onClick={handleCompleteSection}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isCompleted ? 'Complété' : 'Marquer comme complété'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={!getNextSection()}
                >
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
