import Link from "next/link";
import { Code2, Link2, FileDown } from "lucide-react";
import { profile } from "@/data/profile";
import { NoiseToSignalHero } from "@/components/motion/NoiseToSignalHero";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-line py-20 md:py-28"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <NoiseToSignalHero />
      <ParallaxLayer offset={72} className="z-10 mx-auto max-w-6xl px-4 md:px-6">
        <p className="font-mono-label text-xs uppercase tracking-[0.28em] text-signal">
          From noise to signal
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-5xl uppercase leading-[0.95] tracking-wide text-ink md:text-7xl lg:text-8xl">
          {profile.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-base text-ink-muted md:text-lg">{profile.subheadline}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/#transformations"
            className="focus-ring inline-flex items-center gap-2 rounded border border-accent bg-accent-soft px-4 py-2.5 font-mono-label text-xs uppercase tracking-wider text-ink"
          >
            View transformations
          </Link>
          {profile.resumeAvailable ? (
            <a
              href={profile.resumeUrl}
              className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-2.5 font-mono-label text-xs uppercase tracking-wider text-ink hover:border-signal/50"
            >
              <FileDown className="h-4 w-4" aria-hidden />
              Download resume
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded border border-dashed border-line px-4 py-2.5 font-mono-label text-xs uppercase tracking-wider text-ink-muted">
              <FileDown className="h-4 w-4" aria-hidden />
              Resume coming soon
            </span>
          )}
          <a
            href={profile.github}
            className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-2.5 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
          >
            <Code2 className="h-4 w-4" aria-hidden />
            GitHub
          </a>
          <a
            href={profile.linkedin}
            className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-2.5 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
          >
            <Link2 className="h-4 w-4" aria-hidden />
            LinkedIn
          </a>
        </div>
      </ParallaxLayer>
    </section>
  );
}
