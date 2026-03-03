"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Card, CardContent, CardHeader, Input, Label, Select, Textarea } from "@/components/ui";
import { useI18n } from "@/components/I18nProvider";

type PlanLite = { id: string; title: string; created_at: string };
type LogLite = {
  id: string;
  plan_id: string;
  date: string;
  notes: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
};

const schema = z.object({
  plan_id: z.string().uuid(),
  date: z.string().min(1),
  notes: z.string().min(1).max(2000),
  status: z.enum(["todo", "in_progress", "done"]),
});

export function LogsView({
  plans,
  selectedPlanId,
  logs,
}: {
  plans: PlanLite[];
  selectedPlanId: string | null;
  logs: LogLite[];
}) {
  const { t } = useI18n();
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const search = useSearchParams();

  const [planId, setPlanId] = useState(selectedPlanId ?? "");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const planOptions = useMemo(
    () =>
      plans.map((p) => (
        <option key={p.id} value={p.id}>
          {p.title}
        </option>
      )),
    [plans],
  );

  function onSelectPlan(id: string) {
    setPlanId(id);
    const next = new URLSearchParams(search.toString());
    next.set("plan", id);
    router.push(`/app/logs?${next.toString()}`);
  }

  async function addLog(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ plan_id: planId, date, notes, status });
    if (!parsed.success) {
      return setError(parsed.error.issues[0]?.message ?? "Invalid input");
    }
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { error } = await supabase.from("logs").insert({
        plan_id: parsed.data.plan_id,
        user_id: user.id,
        date: parsed.data.date,
        notes: parsed.data.notes,
        status: parsed.data.status,
      });
      if (error) throw new Error(error.message);
      setNotes("");
      setStatus("todo");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("logs.title")}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {t("logs.selectPlan")} → {t("logs.addLog")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium">{t("logs.selectPlan")}</div>
        </CardHeader>
        <CardContent>
          {plans.length ? (
            <Select value={planId} onChange={(e) => onSelectPlan(e.target.value)}>
              {planOptions}
            </Select>
          ) : (
            <div className="text-sm text-black/60 dark:text-white/60">
              No plans yet. Create one in ImpactLab.
            </div>
          )}
        </CardContent>
      </Card>

      {plans.length ? (
        <Card>
          <CardHeader>
            <div className="text-sm font-medium">{t("logs.addLog")}</div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={addLog}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>{t("logs.date")}</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("logs.status")}</Label>
                  <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                    <option value="todo">{t("logs.todo")}</option>
                    <option value="in_progress">{t("logs.inProgress")}</option>
                    <option value="done">{t("logs.done")}</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>{t("logs.notes")}</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <Button disabled={loading} type="submit">
                {loading ? "Saving…" : t("logs.save")}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {selectedPlanId ? (
        <Card>
          <CardHeader>
            <div className="text-sm font-medium">Entries</div>
          </CardHeader>
          <CardContent>
            {logs.length ? (
              <div className="divide-y divide-black/5 dark:divide-white/10">
                {logs.map((l) => (
                  <div key={l.id} className="py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-medium">{l.date}</div>
                      <div className="text-xs text-black/60 dark:text-white/60">
                        {l.status}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-black/80 dark:text-white/80">
                      {l.notes}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-black/60 dark:text-white/60">
                No log entries yet for this plan.
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

