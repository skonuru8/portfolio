import Link from "next/link";
import { cn } from "@/lib/utils";

export type MetricCardProps = {
  value: string;
  label: string;
  description: string;
  linkedTo?: string;
};

export function MetricCard({ value, label, description, linkedTo }: MetricCardProps) {
  const inner = (
    <>
      <p className="font-display text-4xl text-accent md:text-5xl">{value}</p>
      <p className="mt-2 font-mono-label text-[10px] uppercase tracking-[0.18em] text-signal">
        {label}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{description}</p>
      {linkedTo ? (
        <p className="mt-4 font-mono-label text-[10px] uppercase tracking-wider text-ink-muted">
          Open case study →
        </p>
      ) : null}
    </>
  );

  const className = cn(
    "metric-card-edge group card-hover block h-full rounded-xl border border-line bg-panel/80 p-6",
    "hover:bg-panel",
    linkedTo && "focus-within:ring-2 focus-within:ring-signal",
  );

  if (linkedTo) {
    return (
      <Link href={linkedTo} className={cn(className, "focus-ring outline-none")}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
