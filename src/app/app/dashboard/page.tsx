import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader } from "@/components/ui";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: plans } = await supabase
    .from("plans")
    .select("id,title,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Quick loop: plan → log → upload before/after.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/app/impactlab">
          <Card className="hover:border-emerald-600/50">
            <CardHeader>
              <div className="text-sm font-medium">Make an eco plan</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-black/60 dark:text-white/60">
                Generate a structured plan and save it.
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/app/logs">
          <Card className="hover:border-emerald-600/50">
            <CardHeader>
              <div className="text-sm font-medium">Add a log</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-black/60 dark:text-white/60">
                Track progress per plan.
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/app/verify-impact">
          <Card className="hover:border-emerald-600/50">
            <CardHeader>
              <div className="text-sm font-medium">Upload before/after</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-black/60 dark:text-white/60">
                Store proof photos for a plan.
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-medium">Recent plans</div>
        </CardHeader>
        <CardContent>
          {plans && plans.length ? (
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {plans.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-black/60 dark:text-white/60">
                      {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Link
                    className="text-sm text-emerald-700 hover:underline dark:text-emerald-400"
                    href={`/app/logs?plan=${p.id}`}
                  >
                    View logs
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-black/60 dark:text-white/60">
              No plans yet. Create one in ImpactLab.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

