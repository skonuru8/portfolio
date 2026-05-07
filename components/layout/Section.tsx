import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function Section({ id, children, className, ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      // contain: layout paint tells the browser nothing inside this section
      // affects layout or paint outside it — allows skipping offscreen sections.
      className={cn("scroll-mt-24 py-16 md:py-24 [contain:layout_paint]", className)}
    >
      {children}
    </section>
  );
}
