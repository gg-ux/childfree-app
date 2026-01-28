import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { BlogList } from "@/components/ui/blog-list";
import { getAllPosts } from "@/lib/blog";
import { AuthNav } from "@/components/ui/auth-nav";

export const metadata = {
  title: "Blog | Chosn",
  description: "Insights, stories, and resources for the childfree community.",
};

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { tag: activeTag } = await searchParams;
  const allPosts = getAllPosts();

  // Get all unique tags
  const allTags = Array.from(
    new Set(allPosts.flatMap((post) => post.tags || []))
  ).sort();

  // Filter posts by tag if one is selected
  const filteredPosts = activeTag
    ? allPosts.filter((post) => post.tags?.includes(activeTag))
    : allPosts;

  return (
    <div className="min-h-screen bg-background">
      <AuthNav />

      <BlogList posts={filteredPosts} activeTag={activeTag} allTags={allTags} />

      {/* Footer */}
      <footer className="py-12 border-t border-[rgba(0,0,0,0.06)]">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo variant="full" size="md" />
            <div className="flex gap-8">
              {["About", "Blog", "Privacy", "Terms", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="theme-caption text-muted hover:text-foreground transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 text-center">
            <p className="theme-caption text-muted">
              &copy; {new Date().getFullYear()} Chosn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
