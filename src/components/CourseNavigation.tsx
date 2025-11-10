'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { CheckCircle2, Circle, Lock, BookOpen, FileCode, Presentation, ClipboardList } from 'lucide-react';
import type { Course } from '@/types/course';

interface CourseNavigationProps {
  course: Course;
  currentSectionId: string | null;
  completedSections: string[];
  onSectionSelect?: (moduleId: string, sectionId: string) => void;
}

export function CourseNavigation({ 
  course, 
  currentSectionId, 
  completedSections, 
  onSectionSelect 
}: CourseNavigationProps) {
  const totalSections = course.modules.reduce((acc, mod) => acc + mod.sections.length, 0);
  const progressPercentage = (completedSections.length / totalSections) * 100;

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'markdown':
        return <BookOpen className="w-4 h-4" />;
      case 'notebook':
        return <FileCode className="w-4 h-4" />;
      case 'slides':
        return <Presentation className="w-4 h-4" />;
      case 'exercise':
      case 'quiz':
        return <ClipboardList className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression du cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completedSections.length} / {totalSections} sections</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Modules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {course.modules.map((module, moduleIndex) => {
              const moduleSections = module.sections.length;
              const moduleCompleted = module.sections.filter(s => 
                completedSections.includes(s.id)
              ).length;
              const isModuleComplete = moduleSections === moduleCompleted;

              return (
                <AccordionItem key={module.id} value={module.id} className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">
                        {isModuleComplete ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">
                          Module {moduleIndex + 1}: {module.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {moduleCompleted}/{moduleSections} sections • {module.duration}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 ml-8 mt-2">
                      {module.sections.map((section, sectionIndex) => {
                        const isCompleted = completedSections.includes(section.id);
                        const isCurrent = currentSectionId === section.id;
                        const isLocked = false; // Can implement locking logic here

                        return (
                          <Button
                            key={section.id}
                            variant={isCurrent ? 'secondary' : 'ghost'}
                            className={`w-full justify-start h-auto py-2 px-3 ${
                              isCurrent ? 'bg-primary/10 border-l-2 border-primary' : ''
                            }`}
                            onClick={() => onSectionSelect?.(module.id, section.id)}
                            disabled={isLocked}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex-shrink-0">
                                {isLocked ? (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                ) : isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-1">
                                {getSectionIcon(section.type)}
                                <span className="text-sm flex-1 text-left">
                                  {sectionIndex + 1}. {section.title}
                                </span>
                              </div>
                              {section.duration && (
                                <span className="text-xs text-muted-foreground">
                                  {section.duration}
                                </span>
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
