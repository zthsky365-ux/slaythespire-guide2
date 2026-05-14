import { zh } from './zh';
import { en } from './en';

export type Language = 'zh' | 'en';

export const translations = {
  zh,
  en,
};

export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.zh;
}

export function t(translations: ReturnType<typeof getTranslation>, path: string): string {
  const keys = path.split('.');
  let result: unknown = translations;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  return typeof result === 'string' ? result : path;
}
