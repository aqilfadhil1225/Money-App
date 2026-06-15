import type { Metadata } from "next";
import { Barlow, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MISSION CONTROL - FINANCE",
  description: "Proprietary Data Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable} ${robotoMono.variable} h-full antialiased bg-black`}>
      <body className="min-h-full flex flex-col font-sans text-white uppercase selection:bg-white selection:text-black relative">
        <div className="scanline" />

        {/* Decorative Corner Crosshairs */}
        <div className="fixed top-4 left-4 text-zinc-500 z-50 pointer-events-none font-mono text-xs">+</div>
        <div className="fixed top-4 right-4 text-zinc-500 z-50 pointer-events-none font-mono text-xs">+</div>
        <div className="fixed bottom-4 left-4 text-zinc-500 z-50 pointer-events-none font-mono text-xs">+</div>
        <div className="fixed bottom-4 right-4 text-zinc-500 z-50 pointer-events-none font-mono text-xs">+</div>

        {/* Terminal Header */}
        <header className="border-b border-zinc-800 p-4 lg:px-8 flex justify-between items-center text-xs font-mono tracking-widest text-zinc-400 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex gap-4 items-center">
            <span className="w-2 h-2 bg-white inline-block animate-pulse" />
            <span className="text-white font-bold tracking-[0.2em]">SYSTEM: OPERATIONAL</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              [ DASHBOARD ]
            </Link>
            <Link href="/add" className="hover:text-white transition-colors">
              [ ADD DATA ]
            </Link>
            <Link href="/transactions" className="hover:text-white transition-colors">
              [ LOGS ]
            </Link>
          </nav>
        </header>

        <main className="flex-grow pb-32">
          <div className="relative">{children}</div>
        </main>

        {/* Global Footer Scanline / Status */}
        <footer className="border-t border-zinc-800 p-4 lg:px-8 text-xs font-mono tracking-[0.3em] text-zinc-500 flex justify-between items-center bg-black relative z-50">
          <div>SECURE ENCRYPTION ENABLED</div>
          <span>© 2026 MISSION CONTROL SYSTEMS</span>
        </footer>
      </body>
    </html>
  );
}
