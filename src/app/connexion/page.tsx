'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ConnexionPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t.auth.allFieldsRequired);
      return;
    }

    // Verify CAPTCHA (in production)
    if (process.env.NODE_ENV === 'production' && !turnstileToken) {
      setError(t.auth.captchaRequired);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.auth.invalidCredentials);
      } else {
        router.push('/parcours');
        router.refresh();
      }
    } catch (err) {
      setError(t.auth.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/coody-logo.svg"
              alt="Coody"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl text-center">{t.auth.loginTitle}</CardTitle>
          <CardDescription className="text-center">
            {t.auth.loginDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password" className="shrink-0">{t.auth.password}</Label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-xs sm:text-sm text-primary hover:underline whitespace-nowrap"
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            {/* Cloudflare Turnstile CAPTCHA - disabled in development */}
            {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>{t.auth.botProtection}</span>
                </div>
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={setTurnstileToken}
                  onError={() => setError(t.auth.captchaError)}
                  onExpire={() => setTurnstileToken('')}
                  options={{
                    theme: 'light',
                    size: 'normal',
                  }}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || (process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.auth.loggingIn}
                </>
              ) : (
                t.auth.loginButton
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t.auth.noAccount}{' '}
            <Link href="/inscription" className="text-primary hover:underline">
              {t.auth.registerButton}
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/" className="hover:underline">
              {t.common.backToHome}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
