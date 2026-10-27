import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Newsren | Follow a question. Find your perspective.",
  description:
    "Explore the evidence, connect the context, and understand what remains uncertain. An agentic news intelligence course prototype.",
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
