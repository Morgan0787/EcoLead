export const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

export type ImpactLabLanguage = "en" | "ru" | "uz";

export function resolveGroqModel(): string {
  const configuredModel = process.env.GROQ_MODEL ?? process.env.OPENAI_MODEL;

  if (!configuredModel || configuredModel === "gpt-4o-mini") {
    return DEFAULT_GROQ_MODEL;
  }

  return configuredModel;
}

export function languageLabel(language: ImpactLabLanguage): string {
  if (language === "ru") return "Russian";
  if (language === "uz") return "Uzbek";
  return "English";
}
