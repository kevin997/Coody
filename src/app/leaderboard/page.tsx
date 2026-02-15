'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/providers/locale-provider';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Trophy,
  Medal,
  Crown,
  Users,
  ArrowLeft,
  TrendingUp,
} from 'lucide-react';
import { getLevelColor, getLevelLabel } from '@/lib/scoring';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  level: string;
  totalScore: number;
  percentage: number;
  timeTakenSeconds: number;
  completedAt: string;
}

interface Stats {
  totalAssessed: number;
  levelDistribution: Record<string, number>;
  averageScore: number;
}

export default function LeaderboardPage() {
  const { t } = useLocale();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="w-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>;
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.common.home}
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          {t.leaderboard.title}
        </h1>
        <p className="text-muted-foreground">
          {t.leaderboard.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.totalAssessed}</p>
              <p className="text-xs text-muted-foreground">{t.leaderboard.assessed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.averageScore}</p>
              <p className="text-xs text-muted-foreground">{t.leaderboard.averageScore}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Crown className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{stats.levelDistribution.EXPERT || 0}</p>
              <p className="text-xs text-muted-foreground">{t.leaderboard.experts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Medal className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{stats.levelDistribution.ADVANCED || 0}</p>
              <p className="text-xs text-muted-foreground">{t.leaderboard.advanced}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">{t.leaderboard.noLeaderboard}</p>
            <p className="text-muted-foreground">{t.leaderboard.noLeaderboardDesc}</p>
            <Button asChild className="mt-4">
              <Link href="/assessment">{t.leaderboard.startAssessment}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 0, 2].map((podiumIndex) => {
                const entry = leaderboard[podiumIndex];
                if (!entry) return null;
                const isFirst = podiumIndex === 0;
                return (
                  <Card key={entry.id} className={`text-center ${isFirst ? 'md:-mt-4 border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/10' : ''}`}>
                    <CardContent className="pt-6">
                      <div className="mb-2">{getRankIcon(entry.rank)}</div>
                      <Avatar className={`mx-auto mb-2 ${isFirst ? 'h-16 w-16' : 'h-12 w-12'}`}>
                        <AvatarImage src={entry.avatar || undefined} />
                        <AvatarFallback>{entry.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-sm truncate">{entry.name}</p>
                      <Badge className={`mt-1 text-xs ${getLevelColor(entry.level as any)}`}>
                        {getLevelLabel(entry.level as any)}
                      </Badge>
                      <p className="text-lg font-bold mt-2">{entry.percentage}%</p>
                      <p className="text-xs text-muted-foreground">{entry.totalScore} pts</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Full List */}
          {leaderboard.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar || undefined} />
                <AvatarFallback>{entry.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{entry.name}</p>
                <Badge variant="outline" className={`text-xs ${getLevelColor(entry.level as any)}`}>
                  {getLevelLabel(entry.level as any)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-bold">{entry.percentage}%</p>
                <p className="text-xs text-muted-foreground">{entry.totalScore} pts • {formatTime(entry.timeTakenSeconds)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
