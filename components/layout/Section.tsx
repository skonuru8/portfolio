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
      className={cn("scroll-mt-24 py-16 md:py-24", className)}
    >
      {children}
    </section>
  );
}
