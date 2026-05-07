"use client";

import dynamic from "next/dynamic";

// Lazy-load CommandMenu so cmdk (~15KB) stays off the critical-path bundle.
// ssr: false is valid here because this is a Client Component.
const CommandMenu = dynamic(
  () => import("@/components/layout/CommandMenu").then((m) => m.CommandMenu),
  { ssr: false, loading: () => null },
);

export function CommandMenuLoader() {
  return <CommandMenu />;
}
