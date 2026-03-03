"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Card, CardContent, CardHeader, Label, Select } from "@/components/ui";
import { useI18n } from "@/components/I18nProvider";

type PlanLite = { id: string; title: string; created_at: string };

const schema = z.object({
  plan_id: z.string().uuid(),
});

export function VerifyImpactView({ plans }: { plans: PlanLite[] }) {
  const { t } = useI18n();
  const supabase = createSupabaseBrowserClient();

  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
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

  async function upload() {
    setError(null);
    setBeforeUrl(null);
    setAfterUrl(null);

    const parsed = schema.safeParse({ plan_id: planId });
    if (!parsed.success) return setError("Select a plan");
    if (!beforeFile || !afterFile) return setError("Select both images");

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const ts = Date.now();
      const beforePath = `${user.id}/${parsed.data.plan_id}/before-${ts}-${beforeFile.name}`;
      const afterPath = `${user.id}/${parsed.data.plan_id}/after-${ts}-${afterFile.name}`;

      const up1 = await supabase.storage
        .from("impact")
        .upload(beforePath, beforeFile, { upsert: true });
      if (up1.error) throw new Error(up1.error.message);

      const up2 = await supabase.storage
        .from("impact")
        .upload(afterPath, afterFile, { upsert: true });
      if (up2.error) throw new Error(up2.error.message);

      const before = supabase.storage.from("impact").getPublicUrl(beforePath)
        .data.publicUrl;
      const after = supabase.storage.from("impact").getPublicUrl(afterPath)
        .data.publicUrl;

      const { error } = await supabase.from("impact_photos").upsert(
        {
          plan_id: parsed.data.plan_id,
          user_id: user.id,
          before_url: before,
          after_url: after,
        },
        { onConflict: "plan_id,user_id" },
      );
      if (error) throw new Error(error.message);

      setBeforeUrl(before);
      setAfterUrl(after);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("verify.title")}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Upload before/after images for a plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium">{t("verify.selectPlan")}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.length ? (
            <Select value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {planOptions}
            </Select>
          ) : (
            <div className="text-sm text-black/60 dark:text-white/60">
              No plans yet. Create one in ImpactLab.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t("verify.before")}</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("verify.after")}</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <Button disabled={loading || !plans.length} onClick={upload} type="button">
            {loading ? "Uploading…" : t("verify.upload")}
          </Button>
        </CardContent>
      </Card>

      {beforeUrl && afterUrl ? (
        <Card>
          <CardHeader>
            <div className="text-sm font-medium">{t("verify.uploaded")}</div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-black/60 dark:text-white/60">
                {t("verify.before")}
              </div>
              <img className="mt-2 w-full rounded-xl border border-black/10 dark:border-white/10" src={beforeUrl} alt="Before" />
            </div>
            <div>
              <div className="text-xs font-medium text-black/60 dark:text-white/60">
                {t("verify.after")}
              </div>
              <img className="mt-2 w-full rounded-xl border border-black/10 dark:border-white/10" src={afterUrl} alt="After" />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

