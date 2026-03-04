import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader } from "@/components/ui";

export default async function AchievementsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ count: planCount }, { count: logCount }, { count: photoCount }] =
    await Promise.all([
      supabase
        .from("plans")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("impact_photos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("before_url", "is", null)
        .not("after_url", "is", null),
    ]);

  const a1 = (planCount ?? 0) >= 1;
  const a2 = (logCount ?? 0) >= 1;
  const a3 = (photoCount ?? 0) >= 1;
  const tokens = [a1, a2, a3].filter(Boolean).length * 10;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Tokens are computed server-side from your DB state.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium">Tokens</div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{tokens} / 30</div>
          <div className="mt-1 text-sm text-black/60 dark:text-white/60">
            +10 per achievement (max 30).
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <AchievementCard
          title="First Plan Created"
          unlocked={a1}
          hint="Create a plan in ImpactLab."
        />
        <AchievementCard
          title="First Log Added"
          unlocked={a2}
          hint="Add a log entry to any plan."
        />
        <AchievementCard
          title="Before/After Uploaded"
          unlocked={a3}
          hint="Upload before and after images."
        />
      </div>
    </div>
  );
}

function AchievementCard({
  title,
  unlocked,
  hint,
}: {
  title: string;
  unlocked: boolean;
  hint: string;
}) {
  return (
    <Card className={unlocked ? "border-emerald-600/40" : undefined}>
      <CardHeader>
        <div className="text-sm font-medium">{title}</div>
      </CardHeader>
      <CardContent>
        <div
          className={
            unlocked
              ? "text-sm text-emerald-700 dark:text-emerald-400"
              : "text-sm text-black/60 dark:text-white/60"
          }
        >
          {unlocked ? "Unlocked (+10)" : hint}
        </div>
      </CardContent>
    </Card>
  );
}

