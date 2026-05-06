import Link from "next/link";
import { FileDown } from "lucide-react";
import { profile } from "@/data/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Sarath Konuru",
  description: "Download Sarath Konuru’s resume PDF.",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 md:px-6">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-signal">
        Resume
      </p>
      <h1 className="font-display mt-3 text-5xl uppercase tracking-wide text-ink">
        CV &amp; timeline anchor
      </h1>
      <p className="mt-4 text-ink-muted">
        The site leads with proof; this page is the PDF recruiters expect. Last updated{" "}
        {profile.resumeLastUpdated}.
      </p>

      <div className="mt-10 rounded-xl border border-line bg-panel/60 p-6">
        {profile.resumeAvailable ? (
          <a
            href={profile.resumeUrl}
            className="focus-ring inline-flex items-center gap-2 rounded border border-signal bg-signal-soft px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink"
          >
            <FileDown className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
        ) : (
          <div>
            <p className="font-mono-label text-xs uppercase tracking-wider text-ink-muted">
              Resume coming soon
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Place <code className="rounded bg-bg px-1 text-signal">sarath-konuru-resume.pdf</code> in{" "}
              <code className="rounded bg-bg px-1 text-signal">public/resume/</code> and set{" "}
              <code className="rounded bg-bg px-1 text-signal">resumeAvailable: true</code> in{" "}
              <code className="rounded bg-bg px-1 text-signal">data/profile.ts</code>.
            </p>
          </div>
        )}
      </div>

      <p className="mt-10 text-sm text-ink-muted">
        <Link href="/" className="text-signal hover:underline">
          ← Back to portfolio
        </Link>
      </p>
    </div>
  );
}
