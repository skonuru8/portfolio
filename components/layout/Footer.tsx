import Link from "next/link";
import { profile } from "@/data/profile";
import { ExternalLink } from "@/components/ui/ExternalLink";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg-soft py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-display text-2xl uppercase tracking-wide text-ink">
            {profile.shortName}
          </p>
          <p className="mt-1 font-mono-label text-[10px] uppercase tracking-widest text-ink-muted">
            From noise to signal
          </p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono-label text-xs uppercase tracking-wider">
          <Link className="focus-ring text-ink-muted hover:text-signal" href={`mailto:${profile.email}`}>
            Email
          </Link>
          <ExternalLink className="focus-ring text-ink-muted hover:text-signal" href={profile.linkedin}>
            LinkedIn
          </ExternalLink>
          <ExternalLink className="focus-ring text-ink-muted hover:text-signal" href={profile.github}>
            GitHub
          </ExternalLink>
          <Link className="focus-ring text-ink-muted hover:text-signal" href="/resume">
            View resume
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-xs text-ink-muted md:px-6">
        © {new Date().getFullYear()} {profile.shortName}. Jersey City, NJ.
      </p>
    </footer>
  );
}
