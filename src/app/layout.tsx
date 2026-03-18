import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import { BeakerIcon, UsersIcon, CubeIcon, DocumentTextIcon, TruckIcon } from "@heroicons/react/24/outline";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JPS Chemicals | Chemical Supply Management",
  description: "Professional chemical supply chain management with quotations, client history, and workflow automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <BeakerIcon className="h-6 w-6 text-blue-600" />
                JPS Chemicals
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <Link href="/clients" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <UsersIcon className="h-4 w-4" />
                  Clients
                </Link>
                <Link href="/products" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <CubeIcon className="h-4 w-4" />
                  Products
                </Link>
                <Link href="/quotes" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <DocumentTextIcon className="h-4 w-4" />
                  Quotes
                </Link>
                <Link href="/orders" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <TruckIcon className="h-4 w-4" />
                  Orders
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
