export const notes = [
  {
    slug: "cache-first-api-patterns",
    title: "Cache-first API patterns",
    category: "Backend Architecture",
    date: "2026-05",
    summary:
      "Notes on when caching reduces latency and when it creates invalidation problems.",
    tags: ["Redis", "API Design", "Performance"],
    visible: false,
    featured: false,
    order: 1,
  },
];

export function getVisibleNotes() {
  return notes.filter((n) => n.visible).sort((a, b) => a.order - b.order);
}

export function getNoteBySlug(slug: string) {
  return notes.find((n) => n.slug === slug && n.visible);
}
