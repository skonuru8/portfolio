"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { cn } from "@/lib/utils";

const SECTION_LINKS = [
  { href: "/#impact", label: "Impact" },
  { href: "/#transformations", label: "Transformations" },
  { href: "/#thinking", label: "Thinking" },
  { href: "/#work", label: "Work" },
  { href: "/#recognition", label: "Recognition" },
  { href: "/#contact", label: "Contact" },
  { href: "/resume", label: "View resume" },
] as const;

const OPEN_CMD = "portfolio:open-command-palette";

export function NavbarClient({ pdfReady }: { pdfReady: boolean }) {
  const [open, setOpen] = useState(false);
  const [modKey, setModKey] = useState("⌘");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (typeof navigator !== "undefined" && !navigator.platform.toLowerCase().includes("mac")) {
        setModKey("Ctrl");
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const openCommand = () => {
    window.dispatchEvent(new CustomEvent(OPEN_CMD));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="focus-ring font-display text-xl uppercase tracking-wide text-ink"
        >
          {profile.shortName}
        </Link>

        <ul className="hidden flex-wrap items-center justify-end gap-1 md:flex lg:gap-2">
          {SECTION_LINKS.map((l) => (
            <li key={l.href}>
              <MagneticLink
                href={l.href}
                className="focus-ring rounded px-2 py-1 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted transition-colors hover:text-ink lg:text-[11px]"
              >
                {l.label}
              </MagneticLink>
            </li>
          ))}
          {pdfReady ? (
            <li>
              <MagneticLink
                href={profile.resumeUrl}
                external
                className="focus-ring rounded px-2 py-1 font-mono-label text-[10px] uppercase tracking-wider text-signal hover:text-accent lg:text-[11px]"
              >
                Download resume
              </MagneticLink>
            </li>
          ) : null}
          <li>
            <button
              type="button"
              aria-label="Open command menu"
              onClick={openCommand}
              className="focus-ring rounded border border-line bg-panel px-2 py-1 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted transition-colors hover:border-signal/40 hover:text-ink"
            >
              {modKey === "⌘" ? "⌘K" : "Ctrl K"}
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label="Open command menu"
            onClick={openCommand}
            className="focus-ring rounded border border-line px-2 py-1 font-mono-label text-[10px] text-ink-muted"
          >
            {modKey === "⌘" ? "⌘K" : "Ctrl K"}
          </button>
          <button
            type="button"
            className="focus-ring rounded p-2 text-ink"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-line bg-bg md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col px-4 py-3">
          {SECTION_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="focus-ring block py-2 font-mono-label text-xs uppercase tracking-wider text-ink-muted"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {pdfReady ? (
            <li>
              <a
                href={profile.resumeUrl}
                className="focus-ring block py-2 font-mono-label text-xs uppercase tracking-wider text-signal"
                onClick={() => setOpen(false)}
              >
                Download resume
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </header>
  );
}
