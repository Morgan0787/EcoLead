import * as React from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/10 bg-white shadow-sm",
        "dark:border-white/10 dark:bg-zinc-950",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    secondary:
      "bg-black/5 text-black hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
    ghost:
      "bg-transparent text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
  } as const;
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  } as const;
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-zinc-950 dark:focus:ring-emerald-500/30",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-zinc-950 dark:focus:ring-emerald-500/30",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-black/80 dark:text-white/80", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-zinc-950 dark:focus:ring-emerald-500/30",
        className,
      )}
      {...props}
    />
  );
}

