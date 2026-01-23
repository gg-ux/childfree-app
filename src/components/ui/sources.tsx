import { ReactNode } from "react";

interface SourcesProps {
  children: ReactNode;
}

export function Sources({ children }: SourcesProps) {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
        Sources
      </h2>
      <div className="text-sm text-muted space-y-2 [&_a]:text-muted [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-foreground [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-4 [&_ul]:space-y-1 [&_li]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
