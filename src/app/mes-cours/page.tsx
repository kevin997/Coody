'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, TrendingUp, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { loadAllCourses } from '@/lib/courseLoader';
import type { Course } from '@/types/course';

interface DBCourseProgress {
  id: string;
  courseId: string;
  completedSections: string[];
  lastAccessedSection: string | null;
  lastAccessedAt: Date;
  startedAt: Date;
}

export default function MesCoursPage() {
  const { data: session } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<Record<string, DBCourseProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    // Fetch progress from database
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        if (data.progress) {
          // Convert array to object keyed by courseId
          const progressMap: Record<string, DBCourseProgress> = {};
          data.progress.forEach((p: DBCourseProgress) => {
            progressMap[p.courseId] = p;
          });
          setProgressData(progressMap);

          // Load courses that user has started
          const allCourses = loadAllCourses();
          const enrolled = allCourses.filter(course => progressMap[course.id]);
          setEnrolledCourses(enrolled);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load progress:', error);
        setIsLoading(false);
      });
  }, [session]);

  const getCourseProgress = (courseId: string) => {
    const progress = progressData[courseId];
    if (!progress) return 0;

    const course = loadAllCourses().find(c => c.id === courseId);
    if (!course) return 0;

    const totalSections = course.modules.reduce((acc, mod) => acc + mod.sections.length, 0);
    const completedSections = progress.completedSections?.length || 0;

    return totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
  };

  const getLastAccessedSection = (courseId: string) => {
    const progress = progressData[courseId];
    if (!progress?.lastAccessedSection) return null;

    const course = loadAllCourses().find(c => c.id === courseId);
    if (!course) return null;

    for (const module of course.modules) {
      const section = module.sections.find(s => s.id === progress.lastAccessedSection);
      if (section) {
        return { module, section };
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour voir vos cours.
          </p>
          <Button asChild>
            <Link href="/connexion">Se connecter</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Mes Cours
          </h1>
          <p className="text-xl text-muted-foreground">
            Continuez votre apprentissage là où vous vous êtes arrêté
          </p>
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          {enrolledCourses.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mx-auto max-w-md space-y-4">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-bold">Aucun cours en cours</h2>
                <p className="text-muted-foreground">
                  Vous n'avez pas encore commencé de cours. Explorez nos parcours pour commencer votre apprentissage.
                </p>
                <Button size="lg" asChild>
                  <Link href="/parcours">
                    Explorer les parcours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">En cours</h2>
              <div className="grid gap-6">
                {enrolledCourses.map((course) => {
                  const progressPercent = getCourseProgress(course.id);
                  const lastAccessed = getLastAccessedSection(course.id);
                  const progress = progressData[course.id];

                  return (
                    <Card key={course.id}>
                      <div className="md:flex">
                        <div className="flex-1">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                                <CardDescription>{course.description}</CardDescription>
                              </div>
                              <Badge variant="outline">{course.level}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progression</span>
                                <span className="font-medium">{Math.round(progressPercent)}%</span>
                              </div>
                              <Progress value={progressPercent} className="h-2" />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{course.modules.length} modules</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>{progress?.completedSections?.length || 0} sections complétées</span>
                              </div>
                            </div>

                            {/* Last Accessed Section */}
                            {lastAccessed && (
                              <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">
                                  Dernière section visitée:
                                </div>
                                <div className="text-sm font-medium">
                                  {lastAccessed.module.title} → {lastAccessed.section.title}
                                </div>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="gap-3">
                            <Button asChild className="flex-1">
                              <Link href={`/cours/${course.id}`}>
                                <PlayCircle className="mr-2 h-4 w-4" />
                                {progressPercent > 0 ? 'Continuer' : 'Commencer'}
                              </Link>
                            </Button>
                            <Button variant="outline" asChild>
                              <Link href={`/cours/${course.id}`}>
                                Voir les détails
                              </Link>
                            </Button>
                          </CardFooter>
                        </div>

                        {/* Course Info Sidebar */}
                        <div className="md:w-64 border-t md:border-t-0 md:border-l bg-muted/30">
                          <div className="p-6 space-y-4">
                            <div>
                              <h3 className="font-medium mb-2">Modules</h3>
                              <div className="space-y-2">
                                {course.modules.map((module) => {
                                  const moduleSections = module.sections.length;
                                  const completedInModule = module.sections.filter(s =>
                                    progress?.completedSections?.includes(s.id)
                                  ).length;

                                  return (
                                    <div key={module.id} className="text-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground truncate">
                                          {module.title}
                                        </span>
                                        <span className="text-xs font-medium ml-2">
                                          {completedInModule}/{moduleSections}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {progress?.lastAccessedAt && (
                              <div>
                                <h3 className="font-medium mb-1">Dernière visite</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(progress.lastAccessedAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Courses */}
      {enrolledCourses.length > 0 && (
        <section className="container px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-6">Parcours recommandés</h2>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">Continuez votre apprentissage</CardTitle>
                    <CardDescription>
                      Découvrez d'autres parcours pour approfondir vos compétences
                    </CardDescription>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/parcours">
                    Explorer tous les parcours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
