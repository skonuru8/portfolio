"use client";

import { FileDown, ExternalLink as ExternalLinkIcon, Monitor } from "lucide-react";
import { useIsMobile } from "@/lib/motion";
import { profile } from "@/data/profile";

function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={profile.resumeUrl}
        download
        className="focus-ring inline-flex items-center gap-2 rounded border border-signal bg-signal-soft px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink md:py-2.5"
      >
        <FileDown className="h-4 w-4" aria-hidden />
        Download PDF
      </a>
      <a
        href={profile.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring inline-flex items-center gap-2 rounded border border-signal bg-signal-soft px-4 py-3 font-mono-label text-xs uppercase tracking-wider text-ink hover:border-signal/60 md:py-2.5"
      >
        <ExternalLinkIcon className="h-4 w-4" aria-hidden />
        Open in new tab
      </a>
    </div>
  );
}

export function ResumeViewer() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-line bg-panel/60 p-6">
          <div className="mb-4 flex items-start gap-3">
            <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden />
            <p className="text-sm text-ink-muted">
              Inline PDF preview is not supported on mobile browsers.{" "}
              <span className="text-ink">View on a desktop for the embedded viewer</span>, or
              download to read on mobile.
            </p>
          </div>
          <ActionButtons />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <ActionButtons />
      <div className="overflow-hidden rounded-xl border border-line">
        <iframe
          src={profile.resumeUrl}
          title="Resume PDF"
          className="h-[85vh] w-full"
          style={{ display: "block" }}
        >
          {/* Fallback content for screen readers and non-PDF browsers */}
          <p className="sr-only">
            This embedded PDF viewer requires a browser with built-in PDF support.
          </p>
          <p className="p-6 text-sm text-ink-muted">
            Your browser cannot display this PDF inline.{" "}
            <a href={profile.resumeUrl} className="text-signal underline">
              Download or open the resume PDF directly.
            </a>
          </p>
        </iframe>
      </div>
    </div>
  );
}
