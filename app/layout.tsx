import { HeroUIProvider } from "@heroui/react";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-ubuntu',
});

export const metadata: Metadata = {
  title: "SKEMA-gpt",
  description: "L'assistant alumni IA de l'SKEMA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${ubuntu.className} bg-white`}
      >
        <Analytics />
        <HeroUIProvider><Suspense> {children}</Suspense></HeroUIProvider>
      </body>
    </html>
  );
}