'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLocale();

  if (!session?.user) {
    router.push('/connexion');
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container max-w-4xl py-16 px-4">
        <h1 className="text-4xl font-bold mb-8">{t.profilePage.title}</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t.profilePage.profileInfo}</CardTitle>
              <CardDescription>
                {t.profilePage.profileInfoDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex justify-center md:justify-start">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
                    <AvatarFallback className="text-4xl">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{t.profilePage.fullName}</span>
                    </div>
                    <p className="text-lg font-medium">{user.name || t.profilePage.notSet}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="text-lg">{user.email || t.profilePage.notSet}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">{t.profilePage.role}</span>
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      {user.role === 'instructor' ? t.nav.instructor : t.nav.learner}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button variant="outline" disabled>
                  {t.profilePage.editProfileSoon}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/settings">{t.common.settings}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t.profilePage.learningStats}</CardTitle>
              <CardDescription>
                {t.profilePage.learningStatsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground mt-1">{t.profilePage.coursesStarted}</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground mt-1">{t.profilePage.sectionsCompleted}</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">0h</div>
                  <div className="text-sm text-muted-foreground mt-1">{t.profilePage.learningTime}</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button asChild>
                  <Link href="/mes-cours">{t.profilePage.viewMyCourses}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t.profilePage.quickActions}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/parcours">
                  <div className="text-left">
                    <div className="font-semibold">{t.profilePage.explorePaths}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.profilePage.discoverTrainings}
                    </div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/mes-cours">
                  <div className="text-left">
                    <div className="font-semibold">{t.profilePage.continueLearning}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.profilePage.resumeWhereLeft}
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
