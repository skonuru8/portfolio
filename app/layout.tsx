import type { Metadata } from "next";
import { Bebas_Neue, Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandMenuLoader } from "@/components/layout/CommandMenuLoader";
import { AmbientShell } from "@/components/layout/AmbientShell";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { DeviceTierAttribute } from "@/components/layout/DeviceTierAttribute";
import { getSiteUrl } from "@/lib/site-url";
import { ThemeProvider } from "@/lib/theme";

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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
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
      data-theme="dark"
      className={`${bebas.variable} ${syne.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-bg text-ink">
        <ThemeProvider>
        <AmbientShell>
          <DeviceTierAttribute />
          <ScrollProgress />
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
          <CommandMenuLoader />
        </AmbientShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
