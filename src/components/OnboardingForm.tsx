"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { UZBEKISTAN_ZIPCODES } from "@/lib/constants/zipcodes";
import { Button, Card, CardContent, CardHeader, Container, Input, Label, Select } from "@/components/ui";
import { I18nProvider, useI18n } from "@/components/I18nProvider";

const schema = z.object({
  role: z.enum(["student", "eco_club", "government"]),
  group_size: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 500), {
      message: "Group size must be 1–500",
    }),
  awareness_level: z.enum(["low", "medium", "high"]),
  language: z.enum(["en", "ru", "uz"]).default("en"),
  zipcode: z.enum(UZBEKISTAN_ZIPCODES),
});

function Inner({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { t } = useI18n();

  const [role, setRole] = useState<"student" | "eco_club" | "government">(
    "student",
  );
  const [groupSize, setGroupSize] = useState("");
  const [awareness, setAwareness] = useState<"low" | "medium" | "high">("medium");
  const [language, setLanguage] = useState<"en" | "ru" | "uz">("en");
  const [zipcode, setZipcode] = useState<(typeof UZBEKISTAN_ZIPCODES)[number]>(
    UZBEKISTAN_ZIPCODES[0],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const needsGroup = role === "eco_club" || role === "government";

  const zipcodeOptions = useMemo(
    () =>
      UZBEKISTAN_ZIPCODES.map((z) => (
        <option key={z} value={z}>
          {z}
        </option>
      )),
    [],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({
      role,
      group_size: needsGroup ? groupSize : "",
      awareness_level: awareness,
      language,
      zipcode,
    });

    if (!parsed.success) {
      return setError(parsed.error.errors[0]?.message ?? "Invalid input");
    }

    setLoading(true);
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      role: parsed.data.role,
      group_size: parsed.data.group_size,
      awareness_level: parsed.data.awareness_level,
      language: parsed.data.language,
      zipcode: parsed.data.zipcode,
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/app/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Container className="flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <div className="text-xl font-semibold">{t("onboarding.title")}</div>
            <div className="text-sm text-black/60 dark:text-white/60">
              {t("onboarding.subtitle")}
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-1.5">
                <Label>{t("onboarding.role")}</Label>
                <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
                  <option value="student">{t("onboarding.roleStudent")}</option>
                  <option value="eco_club">{t("onboarding.roleEcoClub")}</option>
                  <option value="government">{t("onboarding.roleGovernment")}</option>
                </Select>
              </div>

              {needsGroup ? (
                <div className="grid gap-1.5">
                  <Label>{t("onboarding.groupSize")}</Label>
                  <Input
                    inputMode="numeric"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    placeholder="1–500"
                  />
                </div>
              ) : null}

              <div className="grid gap-1.5">
                <Label>{t("onboarding.awareness")}</Label>
                <Select
                  value={awareness}
                  onChange={(e) => setAwareness(e.target.value as typeof awareness)}
                >
                  <option value="low">{t("onboarding.awarenessLow")}</option>
                  <option value="medium">{t("onboarding.awarenessMedium")}</option>
                  <option value="high">{t("onboarding.awarenessHigh")}</option>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label>{t("onboarding.language")}</Label>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as typeof language)}
                >
                  <option value="uz">{t("onboarding.langUz")}</option>
                  <option value="ru">{t("onboarding.langRu")}</option>
                  <option value="en">{t("onboarding.langEn")}</option>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label>{t("onboarding.zipcode")}</Label>
                <Select value={zipcode} onChange={(e) => setZipcode(e.target.value as typeof zipcode)}>
                  {zipcodeOptions}
                </Select>
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <Button disabled={loading} type="submit">
                {loading ? "Saving…" : t("onboarding.continue")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export function OnboardingForm({ userId }: { userId: string }) {
  return (
    <I18nProvider initialLanguage="en">
      <Inner userId={userId} />
    </I18nProvider>
  );
}

