import Link from "next/link";
import { profile } from "@/data/profile";
import type { Metadata } from "next";
import { isResumePdfAvailable } from "@/lib/resume";
import { ResumeViewer } from "./ResumeViewer";

export async function generateMetadata(): Promise<Metadata> {
  const pdfReady = isResumePdfAvailable();
  return {
    title: "Resume | Sarath Konuru",
    description: pdfReady
      ? "View and download Sarath Konuru's resume PDF."
      : "Resume information and PDF availability for Sarath Konuru.",
  };
}

export default function ResumePage() {
  const pdfReady = isResumePdfAvailable();

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 md:px-6">
      {/* Header */}
      <p className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-signal">
        Resume
      </p>
      <h1 className="font-display mt-3 text-5xl uppercase tracking-wide text-ink">
        CV &amp; timeline anchor
      </h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        The site leads with proof; this page is where you can view or download the résumé PDF.
        Last updated {profile.resumeLastUpdated}.
      </p>

      {pdfReady ? (
        <ResumeViewer />
      ) : (
        <div className="mt-10 rounded-xl border border-line bg-panel/60 p-6">
          <p className="font-mono-label text-xs uppercase tracking-wider text-ink-muted">
            PDF not on server yet
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Add <code className="rounded bg-bg px-1 text-signal">resume.pdf</code> to{" "}
            <code className="rounded bg-bg px-1 text-signal">public/resume/</code>. The site
            detects the file automatically—no config flag required.
          </p>
        </div>
      )}

      <p className="mt-10 text-sm text-ink-muted">
        <Link href="/" className="text-signal hover:underline">
          ← Back to portfolio
        </Link>
      </p>
    </div>
  );
}
