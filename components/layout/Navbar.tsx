"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#impact", label: "Impact" },
  { href: "/#transformations", label: "Transformations" },
  { href: "/#thinking", label: "Thinking" },
  { href: "/#work", label: "Work" },
  { href: "/#recognition", label: "Recognition" },
  { href: "/#contact", label: "Contact" },
  { href: "/resume", label: "Resume" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

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
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="focus-ring rounded px-2 py-1 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted hover:text-ink lg:text-[11px]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="focus-ring rounded p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Menu</span>
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-line bg-bg md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col px-4 py-3">
          {links.map((l) => (
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
        </ul>
      </div>
    </header>
  );
}
