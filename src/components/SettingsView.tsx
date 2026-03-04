"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Card, CardContent, CardHeader, Label, Select } from "@/components/ui";
import { useI18n } from "@/components/I18nProvider";

export function SettingsView({ initialLanguage }: { initialLanguage: string }) {
  const { t, setLanguage } = useI18n();
  const supabase = createSupabaseBrowserClient();
  const normalizedInitialLanguage =
    initialLanguage === "en" || initialLanguage === "ru" || initialLanguage === "uz"
      ? initialLanguage
      : "en";

  const [lang, setLang] = useState<"en" | "ru" | "uz">(normalizedInitialLanguage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .update({ language: lang })
        .eq("id", user.id);
      if (error) throw new Error(error.message);
      setLanguage(lang);
      setMessage("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Language is stored in your profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium">{t("settings.language")}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid max-w-xs gap-1.5">
            <Label>{t("settings.language")}</Label>
            <Select
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
            >
              <option value="uz">{t("onboarding.langUz")}</option>
              <option value="ru">{t("onboarding.langRu")}</option>
              <option value="en">{t("onboarding.langEn")}</option>
            </Select>
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="text-sm text-emerald-700 dark:text-emerald-400">
              {message}
            </div>
          ) : null}

          <Button disabled={saving} onClick={save} type="button">
            {saving ? "Saving…" : t("settings.save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

