type BeforeAfterDiagramProps = {
  beforeLabel: string;
  afterLabel: string;
  beforeItems: string[];
  afterItems: string[];
};

export function BeforeAfterDiagram({
  beforeLabel,
  afterLabel,
  beforeItems,
  afterItems,
}: BeforeAfterDiagramProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-accent/25 bg-accent-soft/20 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-accent">
          {beforeLabel}
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          {beforeItems.map((b) => (
            <li key={b}>— {b}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-signal/25 bg-signal-soft/20 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-signal">
          {afterLabel}
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          {afterItems.map((a) => (
            <li key={a}>— {a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
