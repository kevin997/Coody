'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, Palette, Globe, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();

  if (!session?.user) {
    router.push('/connexion');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container max-w-4xl py-16 px-4">
        <h1 className="text-4xl font-bold mb-2">{t.settingsPage.title}</h1>
        <p className="text-muted-foreground mb-8">
          {t.settingsPage.subtitle}
        </p>

        <div className="grid gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>{t.settingsPage.account}</CardTitle>
              </div>
              <CardDescription>
                {t.settingsPage.accountDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {t.settingsPage.edit}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t.auth.password}</Label>
                  <p className="text-sm text-muted-foreground">••••••••</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {t.settingsPage.change}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>{t.settingsPage.notifications}</CardTitle>
              </div>
              <CardDescription>
                {t.settingsPage.notificationsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.emailNotifications}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.emailNotificationsDesc}
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.courseReminders}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.courseRemindersDesc}
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.announcements}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.announcementsDesc}
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
                <CardTitle>{t.settingsPage.appearance}</CardTitle>
              </div>
              <CardDescription>
                {t.settingsPage.appearanceDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.darkMode}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.darkModeDesc}
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.fontSize}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.fontSizeDesc}
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {t.settingsPage.medium}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>{t.settingsPage.languageRegion}</CardTitle>
              </div>
              <CardDescription>
                {t.settingsPage.languageRegionDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.displayLanguage}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.displayLanguageDesc}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}>
                  {locale === 'fr' ? 'Français' : 'English'}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.timezone}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.timezoneDesc}
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
                <CardTitle>{t.settingsPage.privacySecurity}</CardTitle>
              </div>
              <CardDescription>
                {t.settingsPage.privacySecurityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.publicProfile}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.publicProfileDesc}
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.twoFactor}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.twoFactorDesc}
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {t.settingsPage.enable}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.activeSessions}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.activeSessionsDesc}
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {t.settingsPage.view}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">{t.settingsPage.dangerZone}</CardTitle>
              </div>
              <CardDescription>
                {t.settingsPage.dangerZoneDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.settingsPage.deleteAccount}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.settingsPage.deleteAccountDesc}
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  {t.settingsPage.delete}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Notice */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Note:</strong> {t.settingsPage.settingsNote}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
