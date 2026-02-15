'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardCheck,
  Clock,
  HelpCircle,
  Trophy,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AssessmentItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  durationMinutes: number;
  questionCount: number;
  isCompleted: boolean;
  myAttempt: {
    id: string;
    completedAt: string | null;
    totalScore: number | null;
    percentage: number | null;
    levelAssigned: string | null;
  } | null;
}

export default function AssessmentListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale } = useLocale();
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    fetchAssessments();
  }, [status]);

  async function fetchAssessments() {
    try {
      // Use authenticated endpoint if logged in, public otherwise
      const endpoint = status === 'authenticated' ? '/api/assessments' : '/api/public/assessments';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments);
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  }

  function getLevelBadge(level: string | null) {
    if (!level) return null;
    const colors: Record<string, string> = {
      EXPERT: 'bg-purple-100 text-purple-700 border-purple-200',
      ADVANCED: 'bg-blue-100 text-blue-700 border-blue-200',
      INTERMEDIATE: 'bg-green-100 text-green-700 border-green-200',
      BEGINNER: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    const labels = t.levels as Record<string, string>;
    return (
      <Badge variant="outline" className={colors[level] || ''}>
        {labels[level] || level}
      </Badge>
    );
  }

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.assessment.title}</h1>
          <p className="text-muted-foreground text-lg">
            {t.assessment.subtitle}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <ClipboardCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">{t.assessment.dataStructures}</p>
                <p className="text-xs text-muted-foreground">{t.assessment.dataStructuresDesc}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">{t.assessment.algorithms}</p>
                <p className="text-xs text-muted-foreground">{t.assessment.algorithmsDesc}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <Trophy className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">{t.assessment.oop}</p>
                <p className="text-xs text-muted-foreground">{t.assessment.oopDesc}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessments */}
        {assessments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">{t.assessment.noAssessments}</p>
              <p className="text-muted-foreground">{t.assessment.noAssessmentsDesc}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{locale === 'en' && assessment.titleEn ? assessment.titleEn : assessment.title}</CardTitle>
                      <CardDescription className="mt-1">{locale === 'en' && assessment.descriptionEn ? assessment.descriptionEn : assessment.description}</CardDescription>
                    </div>
                    {assessment.isCompleted && assessment.myAttempt?.levelAssigned && (
                      getLevelBadge(assessment.myAttempt.levelAssigned)
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.durationMinutes} {t.common.minutes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4" />
                      <span>{assessment.questionCount} {t.common.questions}</span>
                    </div>
                  </div>

                  {assessment.isCompleted && assessment.myAttempt ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          {t.assessment.completed} — {assessment.myAttempt.percentage}%
                        </span>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/assessment/${assessment.id}/results`}>
                          {t.assessment.viewResults}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button asChild>
                        <Link href={`/assessment/${assessment.id}`}>
                          {status === 'authenticated'
                            ? (assessment.myAttempt ? t.assessment.resume : t.assessment.start)
                            : t.assessment.tryFree}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      {status !== 'authenticated' && (
                        <span className="text-xs text-muted-foreground">{t.assessment.freeQuestions}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
