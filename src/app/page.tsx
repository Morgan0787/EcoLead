import Link from "next/link";
import { Container, Button, Card, CardContent, CardHeader } from "@/components/ui";

const pillars = [
  {
    title: "Nature-first planning",
    text: "Generate practical plans that focus on green zones, soil health, and water-efficient actions.",
  },
  {
    title: "Track real progress",
    text: "Use status-based logs to convert eco goals into weekly actions your team can actually complete.",
  },
  {
    title: "Verify visible impact",
    text: "Upload before/after evidence and build trust with transparent, measurable improvements.",
  },
];

const modules = [
  "Auth (email/password) + password reset",
  "Onboarding customization (role, language, zipcode)",
  "ImpactLab plan generator (LLM → structured JSON)",
  "Logs per plan (todo / in_progress / done)",
  "Verify Impact (upload before/after images)",
  "Achievements + token count (server-side)",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#d1fae5_0%,_#f8fafc_45%,_#ffffff_100%)] text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#052e16_0%,_#09090b_45%,_#020617_100%)] dark:text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-emerald-900/10 bg-white/80 backdrop-blur dark:border-emerald-100/10 dark:bg-black/30">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
              🌿
            </span>
            EcoLead
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </Container>
      </header>

      <main>
        <Container className="py-14">
          <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <Card className="border-emerald-900/10 bg-white/80 shadow-lg shadow-emerald-900/5 dark:border-emerald-200/15 dark:bg-zinc-950/80">
              <CardHeader className="space-y-4 pb-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-300/80">
                  Community climate action platform
                </p>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Build a greener neighborhood with clear, local, and trackable eco actions.
                </h1>
                <p className="max-w-xl text-sm text-zinc-700 dark:text-zinc-300">
                  EcoLead helps teams create environmental plans, execute tasks, and verify
                  before/after improvements tied to your region zipcode and language.
                </p>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex flex-wrap gap-3">
                  <Link href="/auth/signup">
                    <Button>Get started</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="border border-emerald-800/20 dark:border-emerald-100/20">
                      I already have an account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/10 bg-white/75 dark:border-emerald-200/15 dark:bg-zinc-950/75">
              <CardHeader>
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Platform highlights</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pillars.map((item) => (
                  <div key={item.title} className="rounded-xl border border-emerald-900/10 bg-emerald-50/50 p-3 dark:border-emerald-100/10 dark:bg-emerald-950/20">
                    <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{item.title}</div>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <section className="mt-10">
            <Card className="border-emerald-900/10 bg-white/80 dark:border-emerald-200/15 dark:bg-zinc-950/80">
              <CardHeader>
                <h2 className="text-xl font-semibold tracking-tight">Implemented modules</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Everything below is integrated in the current MVP flow.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {modules.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-emerald-900/10 bg-white p-3 text-sm text-zinc-800 shadow-sm dark:border-emerald-100/10 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      <span className="mr-2 text-emerald-600 dark:text-emerald-300">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </Container>
      </main>
    </div>
  );
}
