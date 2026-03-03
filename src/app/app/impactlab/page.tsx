import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ImpactLabForm } from "@/components/ImpactLabForm";

export default async function ImpactLabPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("zipcode")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");

  return <ImpactLabForm initialZipcode={profile.zipcode} />;
}

