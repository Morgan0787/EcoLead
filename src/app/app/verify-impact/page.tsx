import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VerifyImpactView } from "@/components/VerifyImpactView";

export default async function VerifyImpactPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: plans } = await supabase
    .from("plans")
    .select("id,title,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <VerifyImpactView plans={plans ?? []} />;
}

