type SkillGroupCardProps = {
  group: string;
  items: string[];
};

export function SkillGroupCard({ group, items }: SkillGroupCardProps) {
  return (
    <div className="rounded-xl border border-line bg-panel/50 p-4">
      <h3 className="font-mono-label text-[10px] uppercase tracking-[0.2em] text-signal">
        {group}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded border border-line bg-bg px-2 py-1 text-xs text-ink-muted"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
