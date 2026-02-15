'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  HelpCircle,
  AlertTriangle,
  Shield,
  Monitor,
  ArrowLeft,
  PlayCircle,
  BarChart3,
} from 'lucide-react';

interface AssessmentDetail {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  categoryStats: Record<string, { count: number; points: number }>;
  myAttempt: any;
  isStarted: boolean;
  isCompleted: boolean;
}

export default function AssessmentDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t } = useLocale();
  const id = params.id as string;

  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [showStartDialog, setShowStartDialog] = useState(false);

  const isGuest = status !== 'authenticated';

  useEffect(() => {
    if (status === 'loading') return;
    fetchAssessment();
  }, [status, id]);

  async function fetchAssessment() {
    try {
      const endpoint = isGuest ? `/api/public/assessments/${id}` : `/api/assessments/${id}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setAssessment(data.assessment);
      } else {
        setError(t.common.error);
      }
    } catch {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    // Guests go directly to take page in preview mode (no DB record)
    if (isGuest) {
      router.push(`/assessment/${id}/take`);
      return;
    }

    setStarting(true);
    setError('');

    try {
      const res = await fetch(`/api/assessments/${id}/start`, { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        router.push(`/assessment/${id}/take`);
      } else {
        setError(data.error || t.common.error);
        setShowStartDialog(false);
      }
    } catch {
      setError(t.common.networkError);
      setShowStartDialog(false);
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container px-4 py-8 max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>{error || t.common.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPoints = Object.values(assessment.categoryStats).reduce((s, c) => s + c.points, 0);

  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/assessment">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.assessment.backToAssessments}
        </Link>
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{assessment.title}</CardTitle>
          <CardDescription className="text-base mt-2">{assessment.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{assessment.durationMinutes}</p>
              <p className="text-xs text-muted-foreground">{t.common.minutes}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <HelpCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{assessment.questionCount}</p>
              <p className="text-xs text-muted-foreground">{t.common.questions}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-xs text-muted-foreground">{t.assessment.maxPoints}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{Object.keys(assessment.categoryStats).length}</p>
              <p className="text-xs text-muted-foreground">{t.common.categories}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">{t.assessment.categoryBreakdown}</h3>
            <div className="space-y-2">
              {Object.entries(assessment.categoryStats).map(([cat, stats]) => {
                const labels: Record<string, string> = {
                  DATA_STRUCTURES: t.assessment.dataStructures,
                  ALGORITHMS: t.assessment.algorithms,
                  OOP: t.assessment.oop,
                  CRITICAL_THINKING: t.assessment.criticalThinking,
                  LOGICAL_REASONING: t.assessment.logicalReasoning,
                };
                const weights: Record<string, string> = {
                  DATA_STRUCTURES: '20%',
                  ALGORITHMS: '25%',
                  OOP: '15%',
                  CRITICAL_THINKING: '20%',
                  LOGICAL_REASONING: '20%',
                };
                return (
                  <div key={cat} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{labels[cat] || cat}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.count} {t.common.questions} • {stats.points} {t.common.points} • {t.assessment.weight}: {weights[cat]}
                      </p>
                    </div>
                    <Badge variant="secondary">{stats.count}Q</Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules */}
          <div className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-amber-800 dark:text-amber-200">{t.assessment.rulesTitle}</p>
                <ul className="space-y-1 text-amber-700 dark:text-amber-300">
                  <li>• {t.assessment.ruleFullscreen}</li>
                  <li>• {t.assessment.ruleTabSwitch}</li>
                  <li>• {t.assessment.ruleCopyPaste}</li>
                  <li>• {t.assessment.ruleViolations}</li>
                  <li>• {t.assessment.ruleViolationPenalty}</li>
                  <li>• {t.assessment.ruleMCQFeedback}</li>
                  <li>• {t.assessment.ruleCodeTests}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Guest Notice */}
          {isGuest && (
            <div className="border rounded-lg p-4 bg-primary/5">
              <p className="text-sm font-medium text-primary mb-1">{t.assessment.guestNotice}</p>
              <p className="text-xs text-muted-foreground">
                {t.assessment.guestNoticeDesc}
              </p>
            </div>
          )}

          {/* Action Button */}
          {!isGuest && assessment.isCompleted ? (
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" asChild>
                <Link href={`/assessment/${id}/results`}>
                  {t.assessment.viewResults}
                </Link>
              </Button>
              <Button
                className="flex-1"
                size="lg"
                variant="outline"
                onClick={() => setShowStartDialog(true)}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {t.assessment.retake}
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={() => isGuest ? handleStart() : setShowStartDialog(true)}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              {isGuest
                ? t.assessment.tryFreeButton
                : assessment.isStarted
                  ? t.assessment.resume
                  : t.assessment.start}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Start Confirmation Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                {t.assessment.readyToStart}
              </div>
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>{t.assessment.readyDescription}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>{assessment.durationMinutes} {t.assessment.readyTime}</li>
                <li>{t.assessment.readyInternet}</li>
                <li>{t.assessment.readyQuiet}</li>
                <li>{t.assessment.readyNoTabs}</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowStartDialog(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleStart} disabled={starting}>
              {starting ? t.assessment.starting : t.assessment.startNow}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
