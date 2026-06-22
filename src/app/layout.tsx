import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cercle Coaching",
  description: "Plateforme de coaching",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${nunito.variable} h-full`}>
      <body className="h-full font-[family-name:var(--font-nunito)]">
        {children}
      </body>
    </html>
  );
}
