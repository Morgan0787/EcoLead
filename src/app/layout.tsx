import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoLead",
  description: "Plan, track, and verify your local eco impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
