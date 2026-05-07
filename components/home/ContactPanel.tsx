import Link from "next/link";
import { Mail, Code2, Link2, FileDown } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/layout/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { isResumePdfAvailable } from "@/lib/resume";

export function ContactPanel() {
  const pdfReady = isResumePdfAvailable();

  return (
    <Section
      id="contact"
      ariaLabel="Contact"
      className="relative border-t border-line pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0 motion-gradient opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(160deg, transparent 0%, rgba(56,189,248,0.06) 40%, rgba(99,102,241,0.05) 70%, transparent 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
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
              className="focus-ring card-hover inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink hover:border-signal/40"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {profile.email}
            </a>
          </li>
          <li>
            <ExternalLink
              href={profile.linkedin}
              className="focus-ring card-hover inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              <Link2 className="h-4 w-4" aria-hidden />
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href={profile.github}
              className="focus-ring card-hover inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              <Code2 className="h-4 w-4" aria-hidden />
              GitHub
            </ExternalLink>
          </li>
          <li>
            <Link
              href="/resume"
              className="focus-ring card-hover inline-flex items-center gap-2 rounded border border-line bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
            >
              View resume
            </Link>
          </li>
          {pdfReady ? (
            <li>
              <a
                href={profile.resumeUrl}
                className="focus-ring card-hover inline-flex items-center gap-2 rounded border border-accent/35 bg-panel px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink-muted hover:text-ink"
              >
                <FileDown className="h-4 w-4" aria-hidden />
                Download resume
              </a>
            </li>
          ) : null}
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
