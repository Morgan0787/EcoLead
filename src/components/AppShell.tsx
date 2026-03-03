"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui";
import { useI18n } from "@/components/I18nProvider";

const NAV = [
  { href: "/app/dashboard", key: "nav.dashboard" },
  { href: "/app/impactlab", key: "nav.impactLab" },
  { href: "/app/logs", key: "nav.logs" },
  { href: "/app/verify-impact", key: "nav.verifyImpact" },
  { href: "/app/achievements", key: "nav.achievements" },
  { href: "/app/settings", key: "nav.settings" },
] as const;

export function AppShell({
  children,
  profileZipcode,
}: {
  children: React.ReactNode;
  profileZipcode: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { t } = useI18n();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="border-b border-black/5 bg-white dark:border-white/10 dark:bg-zinc-950">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold tracking-tight">EcoLead</div>
            <div className="hidden text-xs text-black/50 dark:text-white/50 sm:block">
              Zipcode: {profileZipcode}
            </div>
          </div>
          <button
            className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            onClick={signOut}
            type="button"
          >
            {t("auth.signOut")}
          </button>
        </Container>
      </div>

      <Container className="grid gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-zinc-950">
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm",
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </Container>
    </div>
  );
}

