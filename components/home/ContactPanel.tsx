import Link from "next/link";
import { Mail, Code2, Link2, FileDown } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/layout/Section";

export function ContactPanel() {
  return (
    <Section id="contact" ariaLabel="Contact" className="border-t border-line pb-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-4xl uppercase tracking-wide text-ink md:text-5xl">
          Contact
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Ready for backend, full-stack, and cloud engineering roles where production ownership matters.
        </p>

        <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink hover:border-signal/50"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              <Link2 className="h-4 w-4" aria-hidden />
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              <Code2 className="h-4 w-4" aria-hidden />
              GitHub
            </a>
          </li>
          <li>
            {profile.resumeAvailable ? (
              <a
                href={profile.resumeUrl}
                className="focus-ring inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
              >
                <FileDown className="h-4 w-4" aria-hidden />
                Download resume
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded border border-dashed border-line px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted">
                <FileDown className="h-4 w-4" aria-hidden />
                Resume coming soon
              </span>
            )}
          </li>
        </ul>

        <p className="mt-10 text-sm text-ink-muted">
          Last updated {profile.resumeLastUpdated}.{" "}
          <Link href="/resume" className="text-signal underline-offset-4 hover:underline">
            Resume page
          </Link>
        </p>
      </div>
    </Section>
  );
}
