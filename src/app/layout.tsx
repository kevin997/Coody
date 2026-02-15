import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CourseHeader } from '@/components/CourseHeader';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { LocaleProvider } from '@/providers/locale-provider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coody - Plateforme d'Apprentissage en Programmation",
  description: "Apprenez Python, SQL et l'analyse financière avec des cours interactifs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <LocaleProvider>
            <CourseHeader />
            {children}
            <Toaster />
          </LocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
