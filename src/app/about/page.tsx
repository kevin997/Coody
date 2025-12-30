import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">À propos de Coody</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Apprendre à coder,<br />
            <span className="text-primary">simplement et efficacement</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Coody est une plateforme d'apprentissage interactive créée pour rendre 
            la programmation accessible à tous, peu importe votre niveau.
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
                <CardTitle>Notre Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Démocratiser l'apprentissage de la programmation en offrant 
                  des cours de qualité, interactifs et adaptés à tous les niveaux.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Notre Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Devenir la référence francophone de l'apprentissage en ligne 
                  pour la programmation, l'analyse de données et le développement web.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-success mb-2" />
                <CardTitle>Nos Valeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accessibilité, qualité pédagogique, innovation et engagement 
                  envers la réussite de chaque apprenant.
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
              <div className="md:w-1/3 bg-gradient-to-br from-primary to-secondary p-8 flex items-center justify-center relative overflow-hidden">
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
              <div className="md:w-2/3 p-8">
                <Badge className="mb-4">Fondateur & Créateur</Badge>
                <h2 className="text-3xl font-bold mb-2">Ovanga Liboire Kevin</h2>
                <p className="text-muted-foreground mb-6">
                  Développeur autodidacte · Data Analyst · Entrepreneur
                </p>

                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Développeur autodidacte passionné et analyste de données, Kevin est le créateur 
                    de <strong>Coody</strong>, une plateforme d'apprentissage interactive pour 
                    la programmation et l'analyse de données.
                  </p>

                  <p className="text-muted-foreground">
                    En tant que co-fondateur de <a href="https://kursa.csl-brands.com">KURSA</a> et <a href="https://csl-brands.com">CSL Brands</a>, 
                    Kevin a développé une expertise dans la création de solutions innovantes et 
                    évolutives pour les entreprises en ligne.
                  </p>

                  <p className="text-muted-foreground">
                    Sa mission avec Coody est de partager ses connaissances et de rendre 
                    l'apprentissage de la programmation accessible à tous, en combinant 
                    pédagogie de qualité et outils technologiques modernes.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <Badge variant="secondary">
                      <Code className="h-3 w-3 mr-1" />
                      Développement Full-Stack
                    </Badge>
                    <Badge variant="secondary">
                      <Database className="h-3 w-3 mr-1" />
                      Analyse de Données
                    </Badge>
                    <Badge variant="secondary">
                      <Rocket className="h-3 w-3 mr-1" />
                      Entrepreneuriat
                    </Badge>
                    <Badge variant="secondary">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Pédagogie
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
            Pourquoi choisir Coody?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Contenu de Qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Des cours structurés et progressifs, créés par des experts 
                  avec une approche pédagogique éprouvée.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Pratique Interactive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Apprenez en codant directement avec des notebooks Jupyter 
                  intégrés et des exercices pratiques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Suivi Personnalisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suivez votre progression, prenez des notes et reprenez 
                  là où vous vous êtes arrêté.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Accessible Partout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Apprenez à votre rythme, sur n'importe quel appareil, 
                  où que vous soyez.
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-90">Gratuit pour commencer</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">∞</div>
                  <div className="text-sm opacity-90">Apprentissage illimité</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm opacity-90">Accessible en ligne</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">🇫🇷</div>
                  <div className="text-sm opacity-90">Contenu en français</div>
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
            Technologies enseignées
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge className="text-base py-2 px-4">Python</Badge>
                <Badge className="text-base py-2 px-4">SQL</Badge>
                <Badge className="text-base py-2 px-4">Pandas</Badge>
                <Badge className="text-base py-2 px-4">NumPy</Badge>
                <Badge className="text-base py-2 px-4">Matplotlib</Badge>
                <Badge className="text-base py-2 px-4">Analyse Financière</Badge>
                <Badge className="text-base py-2 px-4">Data Science</Badge>
                <Badge className="text-base py-2 px-4">Et plus encore...</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Contactez-moi
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
                N'hésitez pas à me contacter pour toute question ou suggestion concernant Coody!
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
                Prêt à commencer votre apprentissage?
              </CardTitle>
              <CardDescription className="text-base">
                Rejoignez Coody aujourd'hui et commencez votre parcours 
                dans le monde de la programmation et de l'analyse de données.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/inscription">
                  Créer un compte gratuit
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/parcours">
                  Explorer les cours
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
