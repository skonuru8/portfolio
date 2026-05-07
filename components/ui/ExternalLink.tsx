import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "target" | "rel">;

export function ExternalLink({ children, className, ...props }: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
