import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { LineChart } from "@/components/ui/line-chart";
import { StatCards } from "@/components/ui/stat-cards";
import { BarChart, ComparisonBar } from "@/components/ui/bar-chart";
import { Sources } from "@/components/ui/sources";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-display text-3xl md:text-4xl text-foreground mb-6 mt-10 first:mt-0 leading-tight tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="theme-body text-muted text-lg leading-relaxed mb-6">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="theme-body leading-relaxed">{children}</li>
  ),
  a: ({ href, children }) => (
    <Link
      href={href || "#"}
      className="text-forest underline underline-offset-2 hover:text-forest/80 transition-colors"
    >
      {children}
    </Link>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-forest/30 pl-6 my-6 italic text-muted">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-foreground/5 px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-foreground/5 p-4 rounded-xl overflow-x-auto mb-6 text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-border my-10" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      className="rounded-xl my-8 w-full"
    />
  ),
  LineChart,
  StatCards,
  BarChart,
  ComparisonBar,
  Sources,
};
