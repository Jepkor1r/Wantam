import { LangProvider } from "@/lib/i18n";
import type { Metadata } from "next";
import { Anybody, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anybody = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-anybody",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Duka — shelf, till, ping",
  description:
    "Shop OS for informal and formal retail. Voice, M-Pesa, SMS, email. Consent first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anybody.variable} ${inter.variable} ${jetbrains.variable} min-h-dvh bg-dusk-violet antialiased`}
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
