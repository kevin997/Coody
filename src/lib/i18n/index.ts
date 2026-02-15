import { fr } from './fr';
import { en } from './en';
import type { Locale, Dictionary } from './types';

export type { Locale, Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export const DEFAULT_LOCALE: Locale = 'fr';
export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en'];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
