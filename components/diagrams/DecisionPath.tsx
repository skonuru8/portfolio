type DecisionPathProps = {
  steps: string[];
};

export function DecisionPath({ steps }: DecisionPathProps) {
  return (
    <ol className="space-y-3 border-l border-line pl-6">
      {steps.map((s, i) => (
        <li key={s} className="relative">
          <span className="absolute -left-[29px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-signal bg-bg text-[10px] font-bold text-signal">
            {i + 1}
          </span>
          <p className="text-sm text-ink-muted">{s}</p>
        </li>
      ))}
    </ol>
  );
}
