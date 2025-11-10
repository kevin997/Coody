import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, TrendingUp, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loadAllCourses } from '@/lib/courseLoader';

export default function ParcoursPage() {
  const courses = loadAllCourses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Target className="mr-2 h-3 w-3" />
            Parcours d'Apprentissage
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Choisissez Votre Parcours
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Des parcours structurés pour vous accompagner de débutant à expert.
            Chaque parcours comprend des cours, des exercices pratiques et des projets concrets.
          </p>
        </div>
      </section>

      {/* Career Paths */}
      <section className="container px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Python & Finance Path */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <Badge>Débutant</Badge>
              </div>
              <CardTitle className="text-2xl">Python & Finance</CardTitle>
              <CardDescription>
                Devenez analyste financier en maîtrisant Python et SQL
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>10-12 semaines</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Ce que vous apprendrez:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Programmation Python de A à Z</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Gestion de bases de données avec SQL</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Analyse de données financières</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Visualisation et reporting</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="mr-2">Python</Badge>
                  <Badge variant="outline" className="mr-2">SQL</Badge>
                  <Badge variant="outline">Finance</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/cours/python-sql-finance">
                  Commencer ce parcours
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Data Analysis Path - Coming Soon */}
          <Card className="flex flex-col opacity-60">
            <CardHeader>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <Badge variant="secondary">Bientôt</Badge>
              </div>
              <CardTitle className="text-2xl">Data Science</CardTitle>
              <CardDescription>
                Machine Learning et Intelligence Artificielle pour la finance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>14-16 semaines</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Ce que vous apprendrez:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Statistiques et probabilités</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Machine Learning appliqué</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Prédiction de marchés</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="mr-2">Python</Badge>
                  <Badge variant="outline" className="mr-2">ML</Badge>
                  <Badge variant="outline">AI</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                Bientôt disponible
              </Button>
            </CardFooter>
          </Card>

          {/* Trading Algorithms - Coming Soon */}
          <Card className="flex flex-col opacity-60">
            <CardHeader>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Target className="h-6 w-6 text-muted-foreground" />
                </div>
                <Badge variant="secondary">Bientôt</Badge>
              </div>
              <CardTitle className="text-2xl">Trading Algorithmique</CardTitle>
              <CardDescription>
                Créez vos propres algorithmes de trading automatisé
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>12-14 semaines</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Ce que vous apprendrez:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Stratégies de trading</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Backtesting et optimisation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Gestion des risques</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="mr-2">Python</Badge>
                  <Badge variant="outline" className="mr-2">APIs</Badge>
                  <Badge variant="outline">Trading</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                Bientôt disponible
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* All Courses Section */}
      <section className="container px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Cours Disponibles</h2>
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
                      Par {course.instructor}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/cours/${course.id}`}>
                      Voir le cours
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
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Commencez votre apprentissage dès aujourd'hui avec nos parcours structurés
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cours/python-sql-finance">
                Commencer maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
