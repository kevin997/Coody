'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/providers/locale-provider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Home,
  Book,
  Settings,
  LogOut,
  User,
  Menu,
  BookOpen,
  Info,
  ClipboardCheck,
  Trophy,
  Languages,
} from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Separator } from './ui/separator';
import Link from 'next/link';

interface CourseHeaderProps {
  onMenuClick?: () => void;
}

export function CourseHeader({ onMenuClick }: CourseHeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  function navLinkClass(href: string) {
    return `transition-colors hover:text-foreground/80 ${isActive(href) ? 'text-foreground font-semibold' : 'text-foreground/60'
      }`;
  }

  function mobileNavLinkClass(href: string) {
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(href) ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
      }`;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Image
                    src="/coody-logo.svg"
                    alt="Coody"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="font-bold text-xl">Coody</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/')}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-base font-medium">{t.common.home}</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/about')}
                >
                  <Info className="h-5 w-5" />
                  <span className="text-base font-medium">{t.common.about}</span>
                </Link>

                <Link
                  href="/parcours"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/parcours')}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-base font-medium">{t.nav.pathway}</span>
                </Link>

                <Link
                  href="/mes-cours"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/mes-cours')}
                >
                  <Book className="h-5 w-5" />
                  <span className="text-base font-medium">{t.common.myCourses}</span>
                </Link>

                <Link
                  href="/assessment"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/assessment')}
                >
                  <ClipboardCheck className="h-5 w-5" />
                  <span className="text-base font-medium">{t.common.assessment}</span>
                </Link>

                <Link
                  href="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass('/leaderboard')}
                >
                  <Trophy className="h-5 w-5" />
                  <span className="text-base font-medium">{t.common.leaderboard}</span>
                </Link>

                {/* Language switcher (mobile) */}
                <button
                  onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Languages className="h-5 w-5" />
                  <span className="text-base font-medium">{locale === 'fr' ? 'English' : 'Français'}</span>
                </button>

                <Separator className="my-2" />

                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
                          <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{user.name || 'Utilisateur'}</p>
                          <p className="text-xs text-muted-foreground">{user.email || ''}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-base font-medium">{t.common.profile}</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="text-base font-medium">{t.common.settings}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-base font-medium">{t.common.logout}</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Button asChild className="w-full">
                      <Link href="/inscription" onClick={() => setMobileMenuOpen(false)}>
                        {t.common.register}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/connexion" onClick={() => setMobileMenuOpen(false)}>
                        {t.common.login}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/coody-logo.svg"
              alt="Coody"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-xl hidden sm:inline-block">Coody</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
            <Link href="/" className={navLinkClass('/')}>
              {t.common.home}
            </Link>
            <Link href="/about" className={navLinkClass('/about')}>
              {t.common.about}
            </Link>
            <Link href="/parcours" className={navLinkClass('/parcours')}>
              {t.nav.pathway}
            </Link>
            <Link href="/mes-cours" className={navLinkClass('/mes-cours')}>
              {t.common.myCourses}
            </Link>
            <Link href="/assessment" className={navLinkClass('/assessment')}>
              {t.common.assessment}
            </Link>
            <Link href="/leaderboard" className={navLinkClass('/leaderboard')}>
              {t.common.leaderboard}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
            title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
            className="hidden md:flex"
          >
            <span className="text-xs font-bold uppercase">{locale === 'fr' ? 'EN' : 'FR'}</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || ''}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-2">
                      {user.role === 'instructor' ? t.nav.instructor : user.role === 'admin' ? t.nav.admin : t.nav.learner}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t.common.profile}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.common.settings}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.common.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/connexion">{t.common.login}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/inscription">{t.common.register}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
