import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = { title: "Remakeit — Créez des vidéos virales", description: "Transformez vos idées en vidéos courtes qui attirent les vues et génèrent des revenus." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased bg-background`}><body className="min-h-full">{children}</body></html>;
}
