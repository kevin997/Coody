import type { Locale } from './types';

/**
 * Extract locale from request headers (Accept-Language) or query param (?locale=en)
 */
export function getRequestLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = url.searchParams.get('locale');
  if (queryLocale === 'en' || queryLocale === 'fr') return queryLocale;

  const acceptLang = request.headers.get('accept-language') || '';
  if (acceptLang.startsWith('en')) return 'en';
  return 'fr';
}

/**
 * Pick the correct localized field from a DB record.
 * Falls back to the French (default) field if English is not available.
 */
export function localize<T extends Record<string, any>>(
  record: T,
  locale: Locale,
  fields: string[]
): T {
  if (locale === 'fr') return record;

  const result = { ...record };
  for (const field of fields) {
    const enField = `${field}En` as keyof T;
    if (result[enField]) {
      (result as any)[field] = result[enField];
    }
  }
  return result;
}
