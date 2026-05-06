"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SystemCard } from "@/components/cards/SystemCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { SkillGroupCard } from "@/components/cards/SkillGroupCard";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { NoteCard } from "@/components/cards/NoteCard";
import { getVisibleSystems } from "@/data/systems";
import { getVisibleProjects } from "@/data/projects";
import { getVisibleExperience } from "@/data/experience";
import { getVisibleSkills } from "@/data/skills";
import { getVisibleNotes } from "@/data/notes";
import { workFilters, type WorkFilter } from "@/data/navigation";
import { cn } from "@/lib/utils";

type WorkItem =
  | {
      kind: "system";
      title: string;
      type: string;
      domain: string;
      summary: string;
      impact: string[];
      stack: string[];
      tags: string[];
      link: string;
    }
  | {
      kind: "project";
      title: string;
      type: string;
      domain: string;
      summary: string;
      impact: string[];
      stack: string[];
      tags: string[];
      link: string;
      status: string;
    };

export function WorkIndex() {
  const [filter, setFilter] = useState<WorkFilter>("All");

  const items: WorkItem[] = useMemo(() => {
    const systems = getVisibleSystems().map(
      (s): WorkItem => ({
        kind: "system",
        title: s.title,
        type: s.type,
        domain: s.domain,
        summary: s.summary,
        impact: s.impact,
        stack: s.stack,
        tags: s.tags,
        link: `/systems/${s.slug}`,
      }),
    );
    const projects = getVisibleProjects().map(
      (p): WorkItem => ({
        kind: "project",
        title: p.title,
        type: p.type,
        domain: p.domain,
        summary: p.summary,
        impact: p.impact,
        stack: p.stack,
        tags: p.tags,
        link: `/projects/${p.slug}`,
        status: p.status,
      }),
    );
    return [...systems, ...projects];
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((i) => i.tags.some((t) => t === filter));
  }, [items, filter]);

  const experience = getVisibleExperience();
  const skills = getVisibleSkills();
  const notes = getVisibleNotes();

  return (
    <Section id="work" ariaLabel="Work index" className="bg-bg-soft/30">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Browse"
          title="Work index"
          description="Systems, projects, experience, and skills—filterable without burying case studies in job history."
        />

        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter work by category"
        >
          {workFilters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={cn(
                "focus-ring rounded-full border px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wider",
                filter === f
                  ? "border-signal bg-signal-soft text-ink"
                  : "border-line text-ink-muted hover:text-ink",
              )}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) =>
            item.kind === "system" ? (
              <SystemCard
                key={item.link}
                title={item.title}
                type={item.type}
                domain={item.domain}
                summary={item.summary}
                impact={item.impact}
                stack={item.stack}
                tags={item.tags}
                link={item.link}
              />
            ) : (
              <ProjectCard
                key={item.link}
                title={item.title}
                type={item.type}
                domain={item.domain}
                summary={item.summary}
                impact={item.impact}
                stack={item.stack}
                tags={item.tags}
                link={item.link}
                status={item.status}
              />
            ),
          )}
        </div>

        <div className="mt-16">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Experience</h3>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Timeline for context—proof lives in transformations and case studies above.
          </p>
          <div className="mt-8 space-y-10">
            {experience.map((e) => (
              <ExperienceCard
                key={e.company + e.start}
                company={e.company}
                role={e.role}
                location={e.location}
                start={e.start}
                end={e.end}
                summary={e.summary}
                stack={e.stack}
                linkedSystems={e.linkedSystems}
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Skills</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Grouped for scanability—supporting evidence, not the headline.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((s) => (
              <SkillGroupCard key={s.group} group={s.group} items={s.items} />
            ))}
          </div>
        </div>

        {notes.length ? (
          <div className="mt-16">
            <h3 className="font-display text-3xl uppercase tracking-wide text-ink">System notes</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {notes.map((n) => (
                <NoteCard
                  key={n.slug}
                  title={n.title}
                  category={n.category}
                  date={n.date}
                  summary={n.summary}
                  tags={n.tags}
                  href={`/notes/${n.slug}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
