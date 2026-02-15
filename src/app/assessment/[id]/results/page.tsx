'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Shield,
  Award,
  Target,
} from 'lucide-react';
import { getLevelColor, getLevelLabel } from '@/lib/scoring';

interface ResultData {
  id: string;
  assessmentTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  levelAssigned: string;
  timeTakenSeconds: number;
  violationsCount: number;
  isDisqualified: boolean;
  startedAt: string;
  completedAt: string;
  categoryBreakdown: {
    category: string;
    score: number;
    maxScore: number;
    questions: number;
    percentage: number;
  }[];
  answers: {
    questionId: string;
    questionTitle: string;
    questionCategory: string;
    questionSubcategory: string;
    questionType: string;
    questionDifficulty: string;
    maxPoints: number;
    pointsEarned: number;
    isCorrect: boolean;
    timeSpentSeconds: number;
    selectedOptionText: string | null;
    correctOptionText: string | null;
    explanation: string | null;
    submittedCode: string | null;
    languageUsed: string | null;
    testCasesPassed: number;
    testCasesTotal: number;
  }[];
  violations: { type: string; timestamp: string }[];
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useLocale();
  const id = params.id as string;

  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
      return;
    }
    if (status === 'authenticated') fetchResults();
  }, [status]);

  async function fetchResults() {
    try {
      const res = await fetch(`/api/assessments/${id}/results`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  const catLabels: Record<string, string> = {
    DATA_STRUCTURES: t.assessment.dataStructures,
    ALGORITHMS: t.assessment.algorithms,
    OOP: t.assessment.oop,
  };

  if (loading) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto text-center">
        <p>{t.results.title}</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">{t.common.back}</Link>
        </Button>
      </div>
    );
  }

  const levelColorClass = getLevelColor(result.levelAssigned as any);

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/assessment">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.results.backToAssessments}
        </Link>
      </Button>

      {/* Hero Result Card */}
      <Card className="mb-8 overflow-hidden">
        <div className={`p-8 text-center ${result.isDisqualified ? 'bg-destructive/10' : 'bg-primary/5'}`}>
          {result.isDisqualified ? (
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          ) : (
            <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          )}

          <h1 className="text-3xl font-bold mb-2">
            {result.isDisqualified ? 'Disqualified' : t.results.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">{result.assessmentTitle}</p>

          {/* Score Circle */}
          <div className="inline-flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="currentColor" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - (result.percentage || 0) / 100)}`}
                  strokeLinecap="round"
                  className={result.percentage >= 66 ? 'text-green-500' : result.percentage >= 41 ? 'text-yellow-500' : 'text-red-500'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{result.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="mb-4">
            <Badge className={`text-lg px-4 py-1.5 ${levelColorClass}`}>
              <Award className="mr-2 h-5 w-5" />
              {getLevelLabel(result.levelAssigned as any)}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              <span>{result.totalScore}/{result.maxScore} pts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatTime(result.timeTakenSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              <span>{result.violationsCount} violation(s)</span>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="breakdown">{t.results.categoryScores}</TabsTrigger>
          <TabsTrigger value="answers">{locale === 'fr' ? 'Réponses' : 'Answers'}</TabsTrigger>
          <TabsTrigger value="violations">{t.results.violations}</TabsTrigger>
        </TabsList>

        {/* Category Breakdown Tab */}
        <TabsContent value="breakdown">
          <div className="grid gap-4 md:grid-cols-3">
            {result.categoryBreakdown.map((cat) => (
              <Card key={cat.category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{catLabels[cat.category] || cat.category}</CardTitle>
                  <CardDescription>{cat.questions} {t.common.questions}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{cat.percentage}%</div>
                  <Progress value={cat.percentage} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground">{cat.score}/{cat.maxScore} {t.common.points}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Answers Tab */}
        <TabsContent value="answers">
          <div className="space-y-3">
            {result.answers.map((a, i) => (
              <Card key={a.questionId} className={a.isCorrect ? 'border-green-200' : 'border-red-200'}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {a.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                        <span className="font-medium text-sm">{a.questionTitle}</span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{catLabels[a.questionCategory] || a.questionCategory}</Badge>
                        <Badge variant="outline" className="text-xs">{a.questionSubcategory}</Badge>
                        <Badge variant="outline" className="text-xs">{a.questionType === 'CODING' ? 'Code' : 'QCM'}</Badge>
                      </div>
                      {a.questionType === 'MULTIPLE_CHOICE' && (
                        <div className="text-xs space-y-0.5">
                          {a.selectedOptionText && (
                            <p>{locale === 'fr' ? 'Votre réponse' : 'Your answer'}: <span className={a.isCorrect ? 'text-green-600' : 'text-red-600'}>{a.selectedOptionText}</span></p>
                          )}
                          {!a.isCorrect && a.correctOptionText && (
                            <p>{locale === 'fr' ? 'Réponse correcte' : 'Correct answer'}: <span className="text-green-600">{a.correctOptionText}</span></p>
                          )}
                          {a.explanation && <p className="text-muted-foreground italic mt-1">{a.explanation}</p>}
                        </div>
                      )}
                      {a.questionType === 'CODING' && (
                        <p className="text-xs text-muted-foreground">
                          {t.take.passed}: {a.testCasesPassed}/{a.testCasesTotal} • {a.languageUsed}
                        </p>
                      )}
                    </div>
                    <Badge variant={a.isCorrect ? 'default' : 'destructive'} className="shrink-0">
                      {a.pointsEarned}/{a.maxPoints}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations">
          {result.violations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="font-medium">{locale === 'fr' ? 'Aucune violation' : 'No violations'}</p>
                <p className="text-sm text-muted-foreground">{locale === 'fr' ? 'Excellent comportement pendant l\'\u00e9valuation' : 'Excellent behavior during the assessment'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {result.violations.map((v, i) => {
                const labels: Record<string, string> = {
                  TAB_SWITCH: t.take.violationTabSwitch,
                  COPY_PASTE: t.take.violationCopyPaste,
                  RIGHT_CLICK: t.take.violationRightClick,
                  DEV_TOOLS: t.take.violationDevTools,
                  WINDOW_BLUR: t.take.violationWindowBlur,
                  FULLSCREEN_EXIT: t.take.violationFullscreen,
                };
                return (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="text-sm font-medium">{labels[v.type] || v.type}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(v.timestamp).toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/assessment">{t.results.backToAssessments}</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/leaderboard">
            <Trophy className="mr-2 h-4 w-4" />
            {t.common.leaderboard}
          </Link>
        </Button>
      </div>
    </div>
  );
}
