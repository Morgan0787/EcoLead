import en from "./en.json";
import ru from "./ru.json";
import uz from "./uz.json";

export type Language = "en" | "ru" | "uz";

export const DICTIONARIES: Record<Language, typeof en> = {
  en,
  ru,
  uz,
};

export function normalizeLanguage(input: string | null | undefined): Language {
  if (input === "ru" || input === "uz" || input === "en") return input;
  return "en";
}

type Dict = typeof en;

export function t(dict: Dict, key: string): string {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof cur === "string" ? cur : key;
}

