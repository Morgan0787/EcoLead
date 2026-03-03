"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Card, CardContent, CardHeader, Container, Input, Label } from "@/components/ui";

export default function ResetPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/update-password`
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Container className="flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-xl font-semibold">Reset password</div>
            <div className="text-sm text-black/60 dark:text-white/60">
              We’ll email you a reset link.
            </div>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                  Check your email for a reset link.
                </div>
                <Link href="/auth/login">
                  <Button className="w-full" variant="secondary">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error ? (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
                    {error}
                  </div>
                ) : null}

                <Button className="w-full" disabled={loading} type="submit">
                  {loading ? "Sending…" : "Send reset link"}
                </Button>

                <div className="text-sm">
                  <Link className="text-black/70 hover:underline dark:text-white/70" href="/auth/login">
                    Back
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

