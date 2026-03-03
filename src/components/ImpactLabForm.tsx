"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { UZBEKISTAN_ZIPCODES } from "@/lib/constants/zipcodes";
import { Button, Card, CardContent, CardHeader, Input, Label, Select, Textarea } from "@/components/ui";
import { useI18n } from "@/components/I18nProvider";

type GeneratedPlan = {
  summary: string;
  steps: string[];
  materials: string[];
  timeline_weeks: number;
  risks: string[];
  local_notes: string;
};

const inputSchema = z.object({
  title: z.string().min(1),
  goal_description: z.string().min(1),
  area_size_m2: z.coerce.number().min(1),
  season: z.enum(["spring", "summer", "autumn", "winter"]),
  zipcode: z.enum(UZBEKISTAN_ZIPCODES),
  reminder_date: z.string().optional(),
});

export function ImpactLabForm({ initialZipcode }: { initialZipcode: string }) {
  const supabase = createSupabaseBrowserClient();
  const { t } = useI18n();

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [area, setArea] = useState<string>("50");
  const [season, setSeason] = useState<"spring" | "summer" | "autumn" | "winter">(
    "spring",
  );
  const [zipcode, setZipcode] = useState<(typeof UZBEKISTAN_ZIPCODES)[number]>(
    (UZBEKISTAN_ZIPCODES as readonly string[]).includes(initialZipcode)
      ? (initialZipcode as (typeof UZBEKISTAN_ZIPCODES)[number])
      : UZBEKISTAN_ZIPCODES[0],
  );
  const [reminderDate, setReminderDate] = useState<string>("");

  const [generated, setGenerated] = useState<GeneratedPlan | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const zipcodeOptions = useMemo(
    () =>
      UZBEKISTAN_ZIPCODES.map((z) => (
        <option key={z} value={z}>
          {z}
        </option>
      )),
    [],
  );

  async function generateAndSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGenerated(null);
    setSavingId(null);

    const parsed = inputSchema.safeParse({
      title,
      goal_description: goal,
      area_size_m2: area,
      season,
      zipcode,
      reminder_date: reminderDate || undefined,
    });
    if (!parsed.success) {
      return setError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/impactlab/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: parsed.data.title,
          goal_description: parsed.data.goal_description,
          area_size_m2: parsed.data.area_size_m2,
          season: parsed.data.season,
          zipcode: parsed.data.zipcode,
        }),
      });
      const body = (await res.json()) as
        | { plan: GeneratedPlan }
        | { error: string };
      if (!res.ok || "error" in body) {
        throw new Error("error" in body ? body.error : "Failed to generate plan");
      }

      setGenerated(body.plan);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { data, error } = await supabase
        .from("plans")
        .insert({
          user_id: user.id,
          title: parsed.data.title,
          goal_description: parsed.data.goal_description,
          area_size_m2: parsed.data.area_size_m2,
          season: parsed.data.season,
          zipcode: parsed.data.zipcode,
          reminder_date: parsed.data.reminder_date || null,
          plan_json: body.plan,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      setSavingId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("impactLab.title")}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {t("impactLab.makePlan")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium">{t("impactLab.makePlan")}</div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={generateAndSave}>
            <div className="grid gap-1.5">
              <Label>{t("impactLab.planTitle")}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label>{t("impactLab.goalDescription")}</Label>
              <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>{t("impactLab.areaSize")}</Label>
                <Input
                  inputMode="numeric"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label>{t("impactLab.season")}</Label>
                <Select value={season} onChange={(e) => setSeason(e.target.value as typeof season)}>
                  <option value="spring">spring</option>
                  <option value="summer">summer</option>
                  <option value="autumn">autumn</option>
                  <option value="winter">winter</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>{t("impactLab.zipcode")}</Label>
                <Select value={zipcode} onChange={(e) => setZipcode(e.target.value as typeof zipcode)}>
                  {zipcodeOptions}
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>{t("impactLab.reminderDate")}</Label>
                <Input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
                {error}
              </div>
            ) : null}

            <Button disabled={loading} type="submit">
              {loading ? "Generating…" : t("impactLab.generate")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generated ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{t("impactLab.generatedPlan")}</div>
              {savingId ? (
                <div className="text-xs text-black/60 dark:text-white/60">
                  Saved to DB
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-black/60 dark:text-white/60">Summary</div>
                <div className="text-sm">{generated.summary}</div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-black/60 dark:text-white/60">Steps</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                    {generated.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <div className="text-xs font-medium text-black/60 dark:text-white/60">Materials</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {generated.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium text-black/60 dark:text-white/60">
                    Timeline (weeks)
                  </div>
                  <div className="text-sm">{generated.timeline_weeks}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-black/60 dark:text-white/60">Risks</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {generated.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-black/60 dark:text-white/60">Local notes</div>
                <div className="text-sm">{generated.local_notes}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

