'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, Palette, Globe, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    router.push('/connexion');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container max-w-4xl py-16 px-4">
        <h1 className="text-4xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground mb-8">
          Gérez vos préférences et paramètres de compte
        </p>

        <div className="grid gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Compte</CardTitle>
              </div>
              <CardDescription>
                Gérez vos informations de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Modifier
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mot de passe</Label>
                  <p className="text-sm text-muted-foreground">••••••••</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Changer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications sur les nouveaux cours
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rappels de cours</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rappels pour continuer votre apprentissage
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Annonces</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des annonces sur les nouvelles fonctionnalités
                  </p>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Apparence</CardTitle>
              </div>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Basculer entre les thèmes clair et sombre
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Taille de police</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajuster la taille du texte
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Moyen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Langue et région</CardTitle>
              </div>
              <CardDescription>
                Définissez vos préférences de langue et de région
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Langue</Label>
                  <p className="text-sm text-muted-foreground">
                    Langue d'affichage de l'interface
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Français
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fuseau horaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Votre fuseau horaire local
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  UTC+01:00
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Confidentialité et sécurité</CardTitle>
              </div>
              <CardDescription>
                Gérez vos paramètres de confidentialité et de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profil public</Label>
                  <p className="text-sm text-muted-foreground">
                    Rendre votre profil visible aux autres utilisateurs
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Activer
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sessions actives</Label>
                  <p className="text-sm text-muted-foreground">
                    Gérer vos sessions de connexion
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Voir
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Zone de danger</CardTitle>
              </div>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Supprimer le compte</Label>
                  <p className="text-sm text-muted-foreground">
                    Supprimer définitivement votre compte et toutes vos données
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Notice */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Note:</strong> La plupart des fonctionnalités de paramètres seront disponibles dans une prochaine mise à jour.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
