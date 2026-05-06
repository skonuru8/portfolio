import type { Metadata } from "next";
import { Bebas_Neue, Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/layout/CommandMenu";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL != null && process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sarath Konuru | Senior Software Engineer",
  description:
    "Senior Software Engineer building cloud-native systems across Java, Node.js, Python, Azure, AWS, GCP, workflow automation, and AI tooling.",
  openGraph: {
    title: "Sarath Konuru | From Noise to Signal",
    description:
      "Portfolio of Sarath Konuru, Senior Software Engineer turning messy workflows into fast, secure, measurable systems.",
    type: "website",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${syne.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-bg text-ink">
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-panel focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="relative z-10 min-h-[60vh]">
          {children}
        </main>
        <Footer />
        <CommandMenu />
      </body>
    </html>
  );
}
