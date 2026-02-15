'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { HeroCarousel, type PathwaySlide } from '@/components/HeroCarousel';

export default function Home() {
  const { t } = useLocale();
  const [pathways, setPathways] = useState<PathwaySlide[]>([]);

  useEffect(() => {
    fetch('/api/pathways')
      .then((r) => r.json())
      .then((data) => {
        if (data.pathways) setPathways(data.pathways);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Carousel */}
      {pathways.length > 0 ? (
        <HeroCarousel pathways={pathways} />
      ) : (
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="container px-4 py-16 md:py-24">
            <div className="mx-auto max-w-4xl text-center text-white">
              <Badge className="mb-4 bg-white/10 text-white border-white/20" variant="outline">
                {t.home.badge}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-6xl mb-6">
                {t.home.heroTitle1}{' '}
                <span className="text-blue-200">{t.home.heroTitle2}</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t.home.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/parcours">
                    {t.home.startNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-black hover:bg-white/30" asChild>
                  <Link href="/about">{t.home.learnMore}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t.home.whyCoody}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t.home.completeCourses}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.home.completeCoursesDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t.home.practicalExercises}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.home.practicalExercisesDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t.home.realApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.home.realApplicationsDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t.home.forEveryone}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.home.forEveryoneDesc}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 mb-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t.home.readyToStart}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t.home.readySubtitle}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/parcours">
                {t.home.explorePaths}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
