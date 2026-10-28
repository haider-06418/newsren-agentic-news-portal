import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Newsren | Follow a question. Find your perspective.",
  description:
    "Evidence-led news intelligence for developing stories. Explore original sources, compare perspectives, and see what remains uncertain.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
