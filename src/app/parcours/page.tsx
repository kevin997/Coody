'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLocale } from '@/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Code,
  Rocket,
  Users,
  Loader2,
} from 'lucide-react';
import { loadAllCourses } from '@/lib/courseLoader';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap, TrendingUp, BookOpen, Code, Target, Rocket,
};

interface PathwayData {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  description: string;
  descriptionEn?: string;
  icon?: string;
  color?: string;
  level: string;
  duration?: string;
  enrollmentCount: number;
  assessments: {
    id: string;
    title: string;
    titleEn?: string;
    questionCount: number;
    durationMinutes: number;
  }[];
}

export default function ParcoursPage() {
  const { t, locale } = useLocale();
  const { status } = useSession();
  const router = useRouter();
  const courses = loadAllCourses();
  const [pathways, setPathways] = useState<PathwayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/pathways')
      .then((r) => r.json())
      .then((data) => { if (data.pathways) setPathways(data.pathways); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/pathways/enrolled')
      .then((r) => r.json())
      .then((data) => {
        if (data.enrollments) {
          setEnrolledIds(new Set(data.enrollments.map((e: any) => e.pathway.id)));
        }
      })
      .catch(() => { });
  }, [status]);

  async function handleEnroll(pathwayId: string) {
    if (status !== 'authenticated') return;
    setEnrollingId(pathwayId);
    try {
      const res = await fetch(`/api/pathways/${pathwayId}/enroll`, { method: 'POST' });
      if (res.ok) {
        setEnrolledIds((prev) => new Set([...prev, pathwayId]));
        toast.success(locale === 'fr' ? 'Inscription réussie ! Redirection...' : 'Enrolled! Redirecting...');
        // Navigate to the first assessment in the pathway
        const pw = pathways.find((p) => p.id === pathwayId);
        if (pw?.assessments?.[0]) {
          router.push(`/assessment/${pw.assessments[0].id}`);
        }
      }
    } catch { } finally {
      setEnrollingId(null);
    }
  }

  function loc(fr?: string | null, en?: string | null) {
    return locale === 'en' && en ? en : fr || '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Target className="mr-2 h-3 w-3" />
            {t.parcours.badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            {t.parcours.heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.parcours.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Pathways from DB */}
      <section className="container px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {loading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)
          ) : (
            pathways.map((pw) => {
              const Icon = iconMap[pw.icon || 'BookOpen'] || BookOpen;
              const isEnrolled = enrolledIds.has(pw.id);
              const hasAssessments = pw.assessments.length > 0;
              const levelLabels: Record<string, string> = {
                all: locale === 'fr' ? 'Tous niveaux' : 'All levels',
                beginner: locale === 'fr' ? 'Débutant' : 'Beginner',
                intermediate: locale === 'fr' ? 'Intermédiaire' : 'Intermediate',
                advanced: locale === 'fr' ? 'Avancé' : 'Advanced',
              };

              return (
                <Card key={pw.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge>{levelLabels[pw.level] || pw.level}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{loc(pw.title, pw.titleEn)}</CardTitle>
                    <CardDescription>
                      {loc(pw.subtitle, pw.subtitleEn) || loc(pw.description, pw.descriptionEn)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      {pw.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{pw.duration}</span>
                        </div>
                      )}
                      {pw.enrollmentCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{pw.enrollmentCount} {locale === 'fr' ? 'inscrits' : 'enrolled'}</span>
                        </div>
                      )}
                      {hasAssessments && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{locale === 'fr' ? 'Évaluations incluses:' : 'Included assessments:'}</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {pw.assessments.map((a) => (
                              <li key={a.id} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{loc(a.title, a.titleEn)} ({a.questionCount} questions, {a.durationMinutes} min)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    {hasAssessments ? (
                      isEnrolled ? (
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            {locale === 'fr' ? 'Inscrit à ce parcours' : 'Enrolled in this pathway'}
                          </div>
                          <Button className="w-full" asChild>
                            <Link href={`/assessment/${pw.assessments[0].id}`}>
                              {locale === 'fr' ? 'Continuer le parcours' : 'Continue pathway'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ) : status === 'authenticated' ? (
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => handleEnroll(pw.id)}
                          disabled={enrollingId === pw.id}
                        >
                          {enrollingId === pw.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Rocket className="mr-2 h-4 w-4" />
                          )}
                          {locale === 'fr' ? "S'inscrire et commencer" : 'Enroll & start'}
                        </Button>
                      ) : (
                        <Button className="w-full" size="lg" asChild>
                          <Link href={`/assessment/${pw.assessments[0].id}`}>
                            {locale === 'fr' ? 'Essayer gratuitement' : 'Try for free'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        {t.parcours.comingSoonButton}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* All Courses Section */}
      <section className="container px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t.parcours.availableCourses}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules.length} modules</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t.parcours.by} {course.instructor}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/cours/${course.id}`}>
                      {t.parcours.viewCourse}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 pb-16">
        <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t.parcours.readyToTransform}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t.parcours.readyToTransformDesc}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cours/python-sql-finance">
                {t.home.startNow}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
