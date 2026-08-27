import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { Silkscreen } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const pixel = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "kriklún",
  description: "Krič sem, nie na stenu.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk" className={`${GeistMono.variable} ${pixel.variable}`}>
      <body
        style={{ ["--font-mono" as string]: "var(--font-geist-mono)" }}
        className="min-h-dvh"
      >
        <main className="mx-auto max-w-lg px-4 pb-28 pt-5">{children}</main>
        <Nav />
      </body>
    </html>
  );
}
