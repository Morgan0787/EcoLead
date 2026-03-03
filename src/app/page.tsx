import Link from "next/link";
import { Container, Button, Card, CardContent, CardHeader } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-black dark:to-zinc-950">
      <header className="border-b border-black/5 dark:border-white/10">
        <Container className="flex h-16 items-center justify-between">
          <div className="font-semibold tracking-tight">EcoLead</div>
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
        <Container className="py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight">
                Plan, track, and verify your local eco impact.
              </h1>
              <p className="text-black/70 dark:text-white/70">
                EcoLead is a minimal MVP loop: generate an eco plan, log progress,
                and upload before/after photos — all tied to your region zipcode.
              </p>
              <div className="flex gap-3">
                <Link href="/auth/signup">
                  <Button>Get started</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost">I already have an account</Button>
                </Link>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="text-sm font-medium text-black/60 dark:text-white/60">
                  MVP modules
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-black/80 dark:text-white/80">
                  <li>Auth (email/password) + password reset</li>
                  <li>Onboarding customization (role, language, zipcode)</li>
                  <li>ImpactLab plan generator (LLM → structured JSON)</li>
                  <li>Logs per plan (todo / in_progress / done)</li>
                  <li>Verify Impact (upload before/after images)</li>
                  <li>Achievements + token count (server-side)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}
