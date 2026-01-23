import { ReactNode } from "react";

interface SourcesProps {
  children: ReactNode;
}

export function Sources({ children }: SourcesProps) {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xs font-semibold text-muted/70 uppercase tracking-wider mb-4">
        Sources
      </h2>
      <div className="sources-content text-sm text-muted/80 [&_ul]:!text-sm [&_li]:!text-sm [&_p]:!text-sm [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-4 [&_ul]:!mb-0 [&_ul]:space-y-1.5 [&_li]:leading-relaxed [&_a]:text-muted/80 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-foreground [&_em]:text-muted/60">
        {children}
      </div>
    </div>
  );
}
