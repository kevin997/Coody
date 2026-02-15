'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Code,
  Target,
  Rocket,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  TrendingUp,
  BookOpen,
  Code,
  Target,
  Rocket,
};

const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
  blue: {
    bg: 'from-blue-600 to-indigo-700',
    text: 'text-blue-100',
    badge: 'bg-blue-500/30 text-blue-100 border-blue-400/30',
  },
  green: {
    bg: 'from-emerald-600 to-teal-700',
    text: 'text-emerald-100',
    badge: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/30',
  },
  purple: {
    bg: 'from-purple-600 to-violet-700',
    text: 'text-purple-100',
    badge: 'bg-purple-500/30 text-purple-100 border-purple-400/30',
  },
  orange: {
    bg: 'from-orange-600 to-red-700',
    text: 'text-orange-100',
    badge: 'bg-orange-500/30 text-orange-100 border-orange-400/30',
  },
};

export interface PathwaySlide {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  description: string;
  descriptionEn?: string;
  icon?: string;
  color?: string;
  level: string;
  duration?: string;
  enrollmentCount: number;
  assessments: {
    id: string;
    title: string;
    titleEn?: string;
    questionCount: number;
  }[];
}

interface HeroCarouselProps {
  pathways: PathwaySlide[];
}

export function HeroCarousel({ pathways }: HeroCarouselProps) {
  const { t, locale } = useLocale();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = pathways.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 6s
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next, total]);

  if (total === 0) return null;

  const slide = pathways[current];
  const colors = colorMap[slide.color || 'blue'] || colorMap.blue;
  const IconComponent = iconMap[slide.icon || 'BookOpen'] || BookOpen;

  const title = locale === 'en' && slide.titleEn ? slide.titleEn : slide.title;
  const subtitle = locale === 'en' && slide.subtitleEn ? slide.subtitleEn : slide.subtitle;
  const description = locale === 'en' && slide.descriptionEn ? slide.descriptionEn : slide.description;

  const levelLabels: Record<string, string> = {
    all: locale === 'fr' ? 'Tous niveaux' : 'All levels',
    beginner: locale === 'fr' ? 'Débutant' : 'Beginner',
    intermediate: locale === 'fr' ? 'Intermédiaire' : 'Intermediate',
    advanced: locale === 'fr' ? 'Avancé' : 'Advanced',
  };

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`bg-gradient-to-br ${colors.bg} transition-all duration-700 ease-in-out`}
      >
        <div className="container px-4 py-16 md:py-24 relative">
          <div className="mx-auto max-w-4xl text-center text-white">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <IconComponent className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <Badge variant="outline" className={colors.badge}>
                {levelLabels[slide.level] || slide.level}
              </Badge>
              {slide.duration && (
                <Badge variant="outline" className={colors.badge}>
                  {slide.duration}
                </Badge>
              )}
              {slide.assessments.length > 0 && (
                <Badge variant="outline" className={colors.badge}>
                  {slide.assessments.length} {locale === 'fr' ? 'évaluation(s)' : 'assessment(s)'}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className={`text-lg md:text-xl ${colors.text} mb-6 max-w-2xl mx-auto`}>
                {subtitle}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {slide.assessments.length > 0 ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link href={`/assessment/${slide.assessments[0].id}`}>
                    {locale === 'fr' ? 'Commencer l\'évaluation' : 'Start assessment'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/parcours">
                    {locale === 'fr' ? 'Voir le parcours' : 'View pathway'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-black hover:bg-white/50"
                asChild
              >
                <Link href="/parcours">
                  {locale === 'fr' ? 'Tous les parcours' : 'All pathways'}
                </Link>
              </Button>
            </div>

            {/* Enrollment count */}
            {slide.enrollmentCount > 0 && (
              <p className={`text-sm ${colors.text} mt-4 opacity-75`}>
                {slide.enrollmentCount} {locale === 'fr' ? 'inscrits' : 'enrolled'}
              </p>
            )}
          </div>

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="flex justify-center gap-2 pb-6">
            {pathways.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
