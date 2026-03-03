import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LogsView } from "@/components/LogsView";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const planId = (await searchParams).plan ?? null;

  const { data: plans } = await supabase
    .from("plans")
    .select("id,title,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const selectedPlanId = planId ?? plans?.[0]?.id ?? null;

  const { data: logs } = selectedPlanId
    ? await supabase
        .from("logs")
        .select("id,plan_id,date,notes,status,created_at")
        .eq("user_id", user.id)
        .eq("plan_id", selectedPlanId)
        .order("date", { ascending: false })
    : { data: [] as const };

  return (
    <LogsView
      plans={plans ?? []}
      selectedPlanId={selectedPlanId}
      logs={(logs ?? []).map((l) => ({
        ...l,
        date: typeof l.date === "string" ? l.date : String(l.date),
      }))}
    />
  );
}

