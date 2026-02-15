'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  HelpCircle,
  ClipboardCheck,
  BarChart3,
  Shield,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { getLevelLabel, getLevelColor } from '@/lib/scoring';

interface MenteeData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  level: string | null;
  totalScore: number | null;
  assessmentCompleted: boolean;
  assessmentCompletedAt: string | null;
  createdAt: string;
  menteeAssessments: {
    id: string;
    completedAt: string | null;
    totalScore: number | null;
    percentage: number | null;
    levelAssigned: string | null;
    violationsCount: number;
    isDisqualified: boolean;
    assessment: { title: string };
    _count: { violations: number };
  }[];
}

interface QuestionData {
  id: string;
  category: string;
  subcategory: string;
  type: string;
  difficulty: string;
  points: number;
  title: string;
  _count: { menteeAnswers: number };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mentees, setMentees] = useState<MenteeData[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
      return;
    }
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin' && session?.user?.role !== 'instructor') {
        router.push('/');
        return;
      }
      loadData();
    }
  }, [status, session]);

  async function loadData() {
    try {
      const [menteesRes, questionsRes] = await Promise.all([
        fetch('/api/admin/mentees'),
        fetch('/api/admin/questions'),
      ]);

      if (menteesRes.ok) {
        const data = await menteesRes.json();
        setMentees(data.mentees);
      }
      if (questionsRes.ok) {
        const data = await questionsRes.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  }

  const completedCount = mentees.filter((m) => m.assessmentCompleted).length;
  const disqualifiedCount = mentees.filter((m) =>
    m.menteeAssessments.some((a) => a.isDisqualified)
  ).length;

  const catLabels: Record<string, string> = {
    DATA_STRUCTURES: 'Structures de Données',
    ALGORITHMS: 'Algorithmes',
    OOP: 'POO',
  };

  const diffLabels: Record<string, string> = {
    EASY: 'Facile',
    MEDIUM: 'Moyen',
    HARD: 'Difficile',
  };

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Accueil
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Panneau d'Administration
        </h1>
        <p className="text-muted-foreground">
          Gérez les évaluations, questions et mentees
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{mentees.length}</p>
            <p className="text-xs text-muted-foreground">Mentees inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Évaluations complétées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <HelpCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{questions.length}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold">{disqualifiedCount}</p>
            <p className="text-xs text-muted-foreground">Disqualifiés</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mentees">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="mentees">Mentees</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        {/* Mentees Tab */}
        <TabsContent value="mentees">
          <Card>
            <CardHeader>
              <CardTitle>Mentees</CardTitle>
              <CardDescription>Liste de tous les mentees inscrits avec leurs résultats</CardDescription>
            </CardHeader>
            <CardContent>
              {mentees.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun mentee inscrit</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Violations</TableHead>
                        <TableHead>Inscrit le</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentees.map((m) => {
                        const lastAttempt = m.menteeAssessments[0];
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="font-medium">{m.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                            <TableCell>
                              {m.level ? (
                                <Badge variant="outline" className={`text-xs ${getLevelColor(m.level as any)}`}>
                                  {getLevelLabel(m.level as any)}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {lastAttempt?.percentage != null ? (
                                <span className="font-medium">{lastAttempt.percentage}%</span>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                            <TableCell>
                              {lastAttempt?.isDisqualified ? (
                                <Badge variant="destructive" className="text-xs">Disqualifié</Badge>
                              ) : m.assessmentCompleted ? (
                                <Badge variant="default" className="text-xs bg-green-600">Complété</Badge>
                              ) : lastAttempt ? (
                                <Badge variant="secondary" className="text-xs">En cours</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Non démarré</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {lastAttempt ? (
                                <span className={lastAttempt.violationsCount > 0 ? 'text-amber-600 font-medium' : ''}>
                                  {lastAttempt.violationsCount}
                                </span>
                              ) : '—'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Banque de Questions</CardTitle>
              <CardDescription>{questions.length} questions au total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulté</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Réponses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">{q.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {catLabels[q.category] || q.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={q.type === 'CODING' ? 'default' : 'secondary'} className="text-xs">
                            {q.type === 'CODING' ? 'Code' : 'QCM'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              q.difficulty === 'HARD'
                                ? 'border-red-300 text-red-700'
                                : q.difficulty === 'MEDIUM'
                                ? 'border-yellow-300 text-yellow-700'
                                : 'border-green-300 text-green-700'
                            }`}
                          >
                            {diffLabels[q.difficulty] || q.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{q.points}</TableCell>
                        <TableCell>{q._count.menteeAnswers}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
