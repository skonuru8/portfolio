"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export type AwardCardProps = {
  title: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
};

export function AwardCard({ title, organization, year, description, image }: AwardCardProps) {
  const [open, setOpen] = useState(false);
  const hasImage = Boolean(image);

  return (
    <>
      <article className="rounded-xl border border-line bg-panel/60 p-5">
        <button
          type="button"
          className="focus-ring group w-full text-left outline-none"
          onClick={() => hasImage && setOpen(true)}
          disabled={!hasImage}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-bg-soft transition-transform duration-300 group-hover:scale-[1.02]">
            {hasImage ? (
              <Image
                src={image!}
                alt={`${title} — ${organization}`}
                fill
                className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                sizes="(max-width:768px) 100vw, 320px"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono-label text-[10px] uppercase tracking-widest text-ink-muted">
                Image coming soon
              </div>
            )}
          </div>
        </button>
        <h3 className="mt-4 font-display text-lg uppercase tracking-wide text-ink">{title}</h3>
        <p className="font-mono-label text-[10px] uppercase tracking-wider text-ink-muted">
          {organization} · {year}
        </p>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>
      </article>

      {hasImage ? (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-[110] max-h-[90vh] w-[min(900px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl border border-line bg-panel p-4 outline-none"
              aria-describedby={undefined}
            >
              <Dialog.Title className="sr-only">{title}</Dialog.Title>
              <div className="relative mx-auto aspect-[4/3] max-h-[70vh] w-full max-w-3xl">
                <Image
                  src={image!}
                  alt={`${title} — full size`}
                  fill
                  className="object-contain"
                  sizes="900px"
                />
              </div>
              <p className="mt-4 text-center text-sm text-ink-muted">{title}</p>
              <Dialog.Close className="focus-ring mt-4 block w-full rounded border border-line py-2 font-mono-label text-xs uppercase tracking-wider text-ink">
                Close
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ) : null}
    </>
  );
}
