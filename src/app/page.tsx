import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, TrendingUp, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            Plateforme d'Apprentissage
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Apprenez le Code pour la{' '}
            <span className="text-primary">Finance</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Maîtrisez Python, SQL et l'analyse financière avec des cours interactifs,
            des exercices pratiques et des projets concrets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/parcours">
                Commencer maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi choisir Coody ?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Cours Complets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Des parcours structurés du niveau débutant à avancé avec des explications détaillées.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Exercices Pratiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Jupyter Notebooks interactifs pour pratiquer directement dans votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Applications Réelles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Appliquez vos compétences à des cas réels d'analyse financière et de gestion de portefeuille.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Pour Tous</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Adapté aux apprenants et instructeurs avec des outils de suivi de progression.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Course Preview Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Parcours Disponibles
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Commencez votre apprentissage dès aujourd'hui
          </p>

          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    Python & SQL pour la Finance
                  </CardTitle>
                  <CardDescription className="text-base">
                    Programme complet pour maîtriser Python et SQL dans le contexte financier
                  </CardDescription>
                </div>
                <Badge variant="secondary">Débutant</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>4 modules complets • 10-12 semaines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>36 séances de formation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Notebooks Jupyter interactifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Projets pratiques en finance</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <Link href="/cours/python-sql-finance">
                    Commencer le cours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/parcours">Voir les détails</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 mb-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à commencer votre parcours ?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Rejoignez des milliers d'apprenants qui ont déjà transformé leur carrière
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/parcours">
                Explorer les parcours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
