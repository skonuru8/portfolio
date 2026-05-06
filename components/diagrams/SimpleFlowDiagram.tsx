type Step = { label: string; detail?: string };

type SimpleFlowDiagramProps = {
  steps: Step[];
  className?: string;
};

export function SimpleFlowDiagram({ steps, className }: SimpleFlowDiagramProps) {
  return (
    <div
      className={`flex flex-wrap items-stretch gap-2 md:gap-0 ${className ?? ""}`}
      role="list"
      aria-label="Flow diagram"
    >
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center" role="listitem">
          <div className="rounded-lg border border-line bg-panel/80 px-4 py-3 text-center md:min-w-[120px]">
            <p className="font-mono-label text-[10px] uppercase tracking-wider text-signal">
              {s.label}
            </p>
            {s.detail ? (
              <p className="mt-1 text-xs text-ink-muted">{s.detail}</p>
            ) : null}
          </div>
          {i < steps.length - 1 ? (
            <span className="hidden px-2 font-mono-label text-accent md:inline" aria-hidden>
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
