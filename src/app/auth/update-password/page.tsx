"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Card, CardContent, CardHeader, Container, Input, Label } from "@/components/ui";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Container className="flex min-h-screen items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="text-xl font-semibold">Set a new password</div>
            <div className="text-sm text-black/60 dark:text-white/60">
              Choose a new password for your account.
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? "Saving…" : "Save password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

