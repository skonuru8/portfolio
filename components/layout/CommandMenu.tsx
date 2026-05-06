"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { commandItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-[18%] z-[90] w-[min(100%,480px)] -translate-x-1/2",
            "rounded-lg border border-line bg-panel shadow-2xl outline-none",
          )}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Command menu</Dialog.Title>
          <Command className="text-ink">
            <div className="flex items-center gap-2 border-b border-line px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
              <Command.Input
                placeholder="Jump to…"
                className="w-full bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
            <Command.List className="max-h-72 overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-center text-sm text-ink-muted">
                No results.
              </Command.Empty>
              <Command.Group heading="Navigate" className="text-[10px] uppercase tracking-wider text-ink-muted">
                {commandItems.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.keywords}`}
                    onSelect={() => {
                      setOpen(false);
                      if (item.href.startsWith("http") || item.href.startsWith("mailto:")) {
                        window.location.href = item.href;
                      } else {
                        router.push(item.href);
                      }
                    }}
                    className={cn(
                      "flex cursor-pointer items-center rounded px-3 py-2 text-sm text-ink",
                      "data-[selected=true]:bg-accent-soft data-[selected=true]:text-ink",
                    )}
                  >
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
            <div className="border-t border-line px-3 py-2 font-mono-label text-[10px] text-ink-muted">
              <kbd className="rounded border border-line px-1">⌘</kbd>{" "}
              <kbd className="rounded border border-line px-1">K</kbd> to toggle
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
