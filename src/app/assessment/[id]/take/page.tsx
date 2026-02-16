'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  Play,
  Loader2,
  Code2,
  ListChecks,
  Shield,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { useAntiCheat } from '@/hooks/use-anti-cheat';
import { useAssessmentStore } from '@/stores/assessmentStore';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(m => m.default), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

interface QuestionData {
  id: string;
  category: string;
  subcategory: string;
  type: string;
  difficulty: string;
  points: number;
  title: string;
  description: string;
  timeLimitSeconds?: number;
  order: number;
  answered: boolean;
  previousAnswer: any;
  options?: { id: string; optionText: string; order: number }[];
  codingChallenge?: {
    id: string;
    starterCode: Record<string, string>;
    testCases: { input: string; expectedOutput: string; explanation?: string }[];
    hints?: string[];
    constraints?: string;
    expectedComplexity?: { time: string; space: string };
  };
}

export default function AssessmentTakePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { t } = useLocale();
  const assessmentId = params.id as string;

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [menteeAssessmentId, setMenteeAssessmentId] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [code, setCode] = useState('');
  const [codeLang, setCodeLang] = useState('javascript');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [violationWarning, setViolationWarning] = useState('');
  const [runningCode, setRunningCode] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const GUEST_QUESTION_LIMIT = 3;

  // Anti-cheat (only enabled for authenticated users, not guests)
  const { requestFullscreen } = useAntiCheat({
    assessmentId,
    enabled: !!menteeAssessmentId && !isGuestMode,
    onViolation: (type, count, isDisqualified) => {
      const warnings: Record<string, string> = {
        TAB_SWITCH: t.take.violationTabSwitch,
        COPY_PASTE: t.take.violationCopyPaste,
        RIGHT_CLICK: t.take.violationRightClick,
        DEV_TOOLS: t.take.violationDevTools,
        WINDOW_BLUR: t.take.violationWindowBlur,
        FULLSCREEN_EXIT: t.take.violationFullscreen,
      };
      setViolationWarning(`${warnings[type] || 'Violation'} (${count}/5)`);
      setTimeout(() => setViolationWarning(''), 5000);
    },
    onDisqualified: () => {
      router.push(`/assessment/${assessmentId}/results`);
    },
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      loadQuestions();
      requestFullscreen();
    } else {
      // Guest mode: load public preview questions
      setIsGuestMode(true);
      loadGuestQuestions();
    }
  }, [status]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining > 0]);

  // Load question data when switching
  useEffect(() => {
    if (questions.length === 0) return;
    const q = questions[currentIndex];
    if (!q) return;

    const prev = answers[q.id];
    if (q.type === 'MULTIPLE_CHOICE') {
      setSelectedOption(prev?.selectedOptionId || '');
    } else if (q.type === 'CODING') {
      const starter = q.codingChallenge?.starterCode || {};
      setCode(prev?.submittedCode || starter[codeLang] || starter['javascript'] || '');
      setCodeLang(prev?.languageUsed || 'javascript');
    }
    setAnswerFeedback(null);
    setTestResults(null);
  }, [currentIndex, questions]);

  async function loadQuestions() {
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/questions`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t.common.error);
        return;
      }
      const data = await res.json();
      setQuestions(data.questions);
      setTimeRemaining(data.timeRemainingSeconds);
      setMenteeAssessmentId(data.menteeAssessmentId);
      setTotalQuestionsCount(data.totalQuestions);

      // Restore previous answers
      const prevAnswers: Record<string, any> = {};
      for (const q of data.questions) {
        if (q.previousAnswer) {
          prevAnswers[q.id] = q.previousAnswer;
        }
      }
      setAnswers(prevAnswers);
    } catch {
      setError(t.common.networkError);
    } finally {
      setLoading(false);
    }
  }

  async function loadGuestQuestions() {
    try {
      const res = await fetch(`/api/public/assessments/${assessmentId}/questions`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t.common.error);
        return;
      }
      const data = await res.json();
      setQuestions(data.questions);
      setTimeRemaining(data.timeRemainingSeconds);
      setTotalQuestionsCount(data.totalQuestions);
    } catch {
      setError(t.common.networkError);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    const q = questions[currentIndex];
    if (!q) return;
    setSubmittingAnswer(true);
    setAnswerFeedback(null);

    const payload: any = { questionId: q.id, timeSpentSeconds: 0 };
    if (q.type === 'MULTIPLE_CHOICE') {
      payload.selectedOptionId = selectedOption;
    } else {
      payload.submittedCode = code;
      payload.languageUsed = codeLang;
    }

    // Guest mode: save locally, no backend call
    if (isGuestMode) {
      setAnswers((prev) => ({ ...prev, [q.id]: payload }));
      // For MCQ in guest mode, show simple feedback without correct answer
      if (q.type === 'MULTIPLE_CHOICE') {
        setAnswerFeedback({ questionType: 'MULTIPLE_CHOICE', isCorrect: null, guestMode: true });
      }
      setSubmittingAnswer(false);

      // After answering the last guest question, show the login gate
      const answeredCount = Object.keys(answers).length + 1;
      if (answeredCount >= GUEST_QUESTION_LIMIT) {
        setTimeout(() => setShowLoginGate(true), 500);
      }
      return;
    }

    try {
      const res = await fetch(`/api/assessments/${assessmentId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setAnswers((prev) => ({ ...prev, [q.id]: payload }));
        setAnswerFeedback(data);
      } else {
        setError(data.error || t.common.error);
      }
    } catch {
      setError(t.common.networkError);
    } finally {
      setSubmittingAnswer(false);
    }
  }

  async function handleRunCode() {
    const q = questions[currentIndex];
    if (!q?.codingChallenge) return;
    setRunningCode(true);
    setTestResults(null);

    try {
      const res = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: codeLang,
          code,
          testCases: q.codingChallenge.testCases,
        }),
      });
      const data = await res.json();
      setTestResults(data);
    } catch {
      setTestResults({ success: false, error: t.take.executionError });
    } finally {
      setRunningCode(false);
    }
  }

  async function handleSubmitAssessment() {
    setSubmittingAssessment(true);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
      });
      if (res.ok) {
        router.push(`/assessment/${assessmentId}/results`);
      } else {
        const data = await res.json();
        setError(data.error || t.common.error);
      }
    } catch {
      setError(t.common.networkError);
    } finally {
      setSubmittingAssessment(false);
      setShowSubmitDialog(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-16 mb-4" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="font-medium mb-2">{error}</p>
            <Button variant="outline" onClick={() => router.push('/assessment')}>
              {t.assessment.backToAssessments}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const displayTotal = isGuestMode ? totalQuestionsCount : questions.length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const isTimeWarning = timeRemaining < 300; // 5 min warning

  return (
    <div className={`min-h-screen bg-background flex flex-col ${isGuestMode ? '' : 'select-none'}`}>
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {isGuestMode && (
              <Badge variant="secondary" className="gap-1.5 text-xs">
                {t.take.discoveryMode}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              {answeredCount}/{isGuestMode ? `${GUEST_QUESTION_LIMIT} ${t.take.of} ${displayTotal}` : questions.length}
            </Badge>
            <Progress value={progressPercent} className="w-32 h-2" />
          </div>

          {!isGuestMode && (
            <div className={`flex items-center gap-2 font-mono text-lg font-bold ${isTimeWarning ? 'text-destructive animate-pulse' : ''}`}>
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          )}

          {isGuestMode ? (
            <Button size="sm" asChild>
              <Link href="/inscription">
                <UserPlus className="mr-2 h-4 w-4" />
                {t.take.registerButton}
              </Link>
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowSubmitDialog(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              {t.take.finish}
            </Button>
          )}
        </div>

        {/* Guest info bar */}
        {isGuestMode && (
          <div className="bg-primary/5 border-t px-4 py-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>{t.take.guestInfoBar.replace('{total}', String(displayTotal))}</span>
          </div>
        )}

        {/* Violation Warning */}
        {violationWarning && (
          <div className="bg-destructive/10 border-t border-destructive/20 px-4 py-2 flex items-center gap-2 text-sm text-destructive">
            <Shield className="h-4 w-4" />
            {violationWarning}
          </div>
        )}
      </div>

      {/* Question Navigation Pills */}
      <div className="border-b px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`shrink-0 w-8 h-8 rounded-full text-xs font-medium transition-colors ${i === currentIndex
                ? 'bg-primary text-primary-foreground'
                : answers[q.id]
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      {currentQ && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{currentQ.category.replace('_', ' ')}</Badge>
                  <Badge variant="outline">{currentQ.subcategory}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      currentQ.difficulty === 'HARD'
                        ? 'border-red-300 text-red-700'
                        : currentQ.difficulty === 'MEDIUM'
                          ? 'border-yellow-300 text-yellow-700'
                          : 'border-green-300 text-green-700'
                    }
                  >
                    {currentQ.difficulty === 'HARD' ? t.take.hard : currentQ.difficulty === 'MEDIUM' ? t.take.medium : t.take.easy}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">
                  Question {currentIndex + 1}: {currentQ.title}
                </h2>
              </div>
              <Badge className="shrink-0">{currentQ.points} pts</Badge>
            </div>

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
                  {currentQ.description}
                </div>
              </CardContent>
            </Card>

            {/* MCQ Options */}
            {currentQ.type === 'MULTIPLE_CHOICE' && currentQ.options && (
              <div className="space-y-4">
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={!!answerFeedback}>
                  {currentQ.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === opt.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        } ${answerFeedback && selectedOption === opt.id
                          ? answerFeedback.isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : ''
                        }`}
                    >
                      <RadioGroupItem value={opt.id} id={opt.id} className="mt-0.5" />
                      <Label htmlFor={opt.id} className="cursor-pointer flex-1 text-sm leading-relaxed">
                        {opt.optionText}
                      </Label>
                      {answerFeedback && selectedOption === opt.id && (
                        answerFeedback.isCorrect
                          ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                          : <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {answerFeedback && (
                  <Alert variant={answerFeedback.isCorrect ? 'default' : 'destructive'}>
                    {answerFeedback.isCorrect
                      ? <CheckCircle2 className="h-4 w-4" />
                      : <XCircle className="h-4 w-4" />}
                    <AlertDescription>
                      {answerFeedback.isCorrect
                        ? (t.take.correctAnswer || 'Bonne réponse !')
                        : (t.take.wrongAnswer || 'Mauvaise réponse. Vous ne pouvez pas modifier votre choix.')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Coding Editor */}
            {currentQ.type === 'CODING' && (
              <div className="space-y-4">
                {/* Language Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Langage:</span>
                  {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                    <Button
                      key={lang}
                      variant={codeLang === lang ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCodeLang(lang);
                        const starter = currentQ.codingChallenge?.starterCode || {};
                        if (!answers[currentQ.id]) {
                          setCode(starter[lang] || '');
                        }
                      }}
                    >
                      {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Constraints */}
                {currentQ.codingChallenge?.constraints && (
                  <Alert>
                    <Code2 className="h-4 w-4" />
                    <AlertDescription className="text-xs">{currentQ.codingChallenge.constraints}</AlertDescription>
                  </Alert>
                )}

                {/* Editor */}
                <div className="code-editor-area border rounded-lg overflow-hidden">
                  <MonacoEditor
                    height="400px"
                    language={codeLang === 'cpp' ? 'cpp' : codeLang}
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                    }}
                  />
                </div>

                {/* Run & Test */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRunCode} disabled={runningCode || !code}>
                    {runningCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    {runningCode ? t.take.runningCode : t.take.runCode}
                  </Button>
                </div>

                {/* Test Results */}
                {testResults && (
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {testResults.compileError ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : testResults.totalPassed === testResults.totalTests ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        {testResults.compileError
                          ? t.take.executionError
                          : `${testResults.totalPassed}/${testResults.totalTests} ${t.take.passed}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                      {testResults.compileError ? (
                        <pre className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded overflow-x-auto">
                          {testResults.compileError}
                        </pre>
                      ) : (
                        <div className="space-y-2">
                          {testResults.results?.map((r: any, i: number) => (
                            <div key={i} className={`text-xs p-2 rounded border ${r.passed ? 'bg-green-50 border-green-200 dark:bg-green-950/20' : 'bg-red-50 border-red-200 dark:bg-red-950/20'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                {r.passed ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-red-600" />}
                                <span className="font-medium">Test {r.testCase}</span>
                                <span className="text-muted-foreground">{r.executionTimeMs}ms</span>
                              </div>
                              {!r.passed && (
                                <div className="pl-5 space-y-0.5">
                                  <p>{t.take.input}: <code>{r.input}</code></p>
                                  <p>{t.take.expected}: <code>{r.expected}</code></p>
                                  <p>{t.take.got}: <code>{r.actual || ''}</code></p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Hints */}
                {currentQ.codingChallenge?.hints && currentQ.codingChallenge.hints.length > 0 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      {t.take.hints} ({(currentQ.codingChallenge.hints as string[]).length})
                    </summary>
                    <ul className="mt-2 space-y-1 pl-4 list-disc text-muted-foreground">
                      {(currentQ.codingChallenge.hints as string[]).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}

            {/* Submit Answer Button */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t.common.previous}
              </Button>

              <Button onClick={handleSubmitAnswer} disabled={submittingAnswer}>
                {submittingAnswer ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {t.take.saveAnswer}
              </Button>

              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
              >
                {t.common.next}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Assessment Dialog (authenticated only) */}
      {!isGuestMode && (
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.take.finishTitle}</DialogTitle>
              <DialogDescription>
                <div className="space-y-2 pt-2">
                  <p>
                    {t.take.finishDescription.replace('{answered}', String(answeredCount)).replace('{total}', String(questions.length))}
                  </p>
                  {answeredCount < questions.length && (
                    <p className="text-amber-600">
                      {t.take.finishWarning.replace('{count}', String(questions.length - answeredCount))}
                    </p>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                {t.take.continueAssessment}
              </Button>
              <Button
                variant="destructive"
                onClick={handleSubmitAssessment}
                disabled={submittingAssessment}
              >
                {submittingAssessment ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {submittingAssessment ? t.take.submitting : t.take.submitFinal}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Guest Login Gate Dialog */}
      <Dialog open={showLoginGate} onOpenChange={setShowLoginGate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t.take.loginGateTitle}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  {t.take.loginGateDescription.replace('{limit}', String(GUEST_QUESTION_LIMIT)).replace('{total}', String(totalQuestionsCount))}
                </p>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {t.take.loginGateAccess}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {t.take.loginGateSave}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {t.take.loginGateLeaderboard}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {t.take.loginGateMentoring}
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <Button size="lg" asChild>
              <Link href={`/inscription?redirect=/assessment/${assessmentId}`}>
                <UserPlus className="mr-2 h-5 w-5" />
                {t.take.loginGateRegister}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/connexion?redirect=/assessment/${assessmentId}`}>
                <LogIn className="mr-2 h-5 w-5" />
                {t.take.loginGateLogin}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLoginGate(false)}
              className="text-muted-foreground"
            >
              {t.take.loginGateDismiss}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
