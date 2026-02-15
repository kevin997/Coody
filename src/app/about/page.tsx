'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocale } from '@/providers/locale-provider';
import {
  Code,
  Database,
  GraduationCap,
  Heart,
  Lightbulb,
  Rocket,
  Target,
  Users,
  Globe,
  BookOpen,
  Mail,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">{t.about.badge}</Badge>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-6">
            {t.about.heroTitle1}<br />
            <span className="text-primary">{t.about.heroTitle2}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t.about.ourMission}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.ourMissionDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-accent mb-2" />
                <CardTitle>{t.about.ourVision}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.ourVisionDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-success mb-2" />
                <CardTitle>{t.about.ourValues}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.ourValuesDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-primary to-secondary p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-full h-64 md:h-full min-h-[300px]">
                  <Image
                    src="/photo-de-ovanga-liboire-kevin-en-salle-de-formation.jpg"
                    alt="Ovanga Liboire Kevin - Fondateur de Coody"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-4 md:p-8">
                <Badge className="mb-4">{t.about.founderBadge}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-2"><a href="https://www.linkedin.com/in/ovanga-liboire-kevin-titan/">Ovanga Liboire Kevin</a></h2>
                <p className="text-muted-foreground mb-6">
                  {t.about.founderSubtitle}
                </p>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {t.about.founderBio1}
                  </p>

                  <p className="text-muted-foreground">
                    {t.about.founderBio2}
                  </p>

                  <p className="text-muted-foreground">
                    {t.about.founderBio3}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <Badge variant="secondary">
                      <Code className="h-3 w-3 mr-1" />
                      {t.about.fullStackDev}
                    </Badge>
                    <Badge variant="secondary">
                      <Database className="h-3 w-3 mr-1" />
                      {t.about.dataAnalysis}
                    </Badge>
                    <Badge variant="secondary">
                      <Rocket className="h-3 w-3 mr-1" />
                      {t.about.entrepreneurship}
                    </Badge>
                    <Badge variant="secondary">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {t.about.pedagogy}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Coody Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t.about.whyCoody}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t.about.qualityContent}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.qualityContentDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t.about.interactivePractice}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.interactivePracticeDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t.about.personalizedTracking}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.personalizedTrackingDesc}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{t.about.accessibleEverywhere}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.about.accessibleEverywhereDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-90">{t.about.freeToStart}</div>
                </div>
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-2">∞</div>
                  <div className="text-sm opacity-90">{t.about.unlimitedLearning}</div>
                </div>
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">{t.about.accessibleOnline}</div>
                </div>
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-2">�</div>
                  <div className="text-sm opacity-90">{t.about.contentInFrench}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t.about.technologiesTaught}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge className="text-base py-2 px-4">Python</Badge>
                <Badge className="text-base py-2 px-4">SQL</Badge>
                <Badge className="text-base py-2 px-4">Pandas</Badge>
                <Badge className="text-base py-2 px-4">NumPy</Badge>
                <Badge className="text-base py-2 px-4">Matplotlib</Badge>
                <Badge className="text-base py-2 px-4">{t.about.financialAnalysis}</Badge>
                <Badge className="text-base py-2 px-4">Data Science</Badge>
                <Badge className="text-base py-2 px-4">{t.about.andMore}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t.about.contactMe}
          </h2>
          <Card>
            <CardContent className="py-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <a
                  href="mailto:kevinliboire@gmail.com"
                  className="flex items-center gap-4 p-6 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                      kevinliboire@gmail.com
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/237680170569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 rounded-lg border border-border hover:border-success hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full group-hover:bg-success/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">WhatsApp</div>
                    <div className="font-medium text-foreground group-hover:text-success transition-colors">
                      +237 680 17 05 69
                    </div>
                  </div>
                </a>
              </div>

              <p className="text-center text-muted-foreground mt-8">
                {t.about.contactDesc}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t.about.readyToLearn}
              </CardTitle>
              <CardDescription className="text-base">
                {t.about.readyToLearnDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/inscription">
                  {t.about.createFreeAccount}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/parcours">
                  {t.about.exploreCourses}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
