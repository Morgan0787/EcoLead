const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const groqModel = process.env.GROQ_MODEL ?? process.env.OPENAI_MODEL ?? "llama-3.1-8b-instant";
const groqApiKey = process.env.GROQ_API_KEY;

function mask(value: string | undefined | null, visible: number): string {
  if (!value) return "Missing";
  return `${value.slice(0, visible)}***`;
}

export default function EnvCheckPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <h1 className="text-lg font-semibold tracking-tight">Environment check</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          This page helps verify your local configuration without exposing secrets.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium">NEXT_PUBLIC_SUPABASE_URL</dt>
            <dd className="text-right text-black/80 dark:text-white/80">
              {mask(supabaseUrl, 12)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</dt>
            <dd className="text-right text-black/80 dark:text-white/80">
              {mask(supabaseAnonKey, 8)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium">GROQ_MODEL</dt>
            <dd className="text-right text-black/80 dark:text-white/80">
              {groqModel || "Missing"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium">GROQ_API_KEY</dt>
            <dd className="text-right text-black/80 dark:text-white/80">
              {groqApiKey ? "Present" : "Missing"}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}

