import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Flourish",
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

  const [featuredPost, ...otherPosts] = filteredPosts;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="sm" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="theme-body text-sm text-foreground"
            >
              Blog
            </Link>
            <Button asChild size="sm" variant="accent">
              <Link href="/sign-up">Join waitlist</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-12">
        <div className="container-main">
          <h1 className="font-display text-fluid-h1 text-foreground leading-[0.9] tracking-tight mb-6">
            Blog
          </h1>
          {/* Tag filter */}
          <div className="flex items-center gap-x-3 theme-body text-base md:text-lg overflow-x-auto scrollbar-hide pb-2 -mb-2">
            <Link
              href="/blog"
              className={`whitespace-nowrap transition-colors ${
                !activeTag ? "text-forest font-semibold" : "text-muted hover:text-forest"
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => (
              <span key={tag} className="flex items-center gap-3 shrink-0">
                <span className="text-border">·</span>
                <Link
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={`whitespace-nowrap transition-colors ${
                    activeTag === tag ? "text-forest font-semibold" : "text-muted hover:text-forest"
                  }`}
                >
                  {tag}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20">
        <div className="container-main">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="theme-body text-muted">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="group block mb-12">
                  <article className="grid md:grid-cols-2 gap-6 md:gap-10">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-foreground/5">
                      {featuredPost.image ? (
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forest/20 to-forest/5" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredPost.tags.map((tag) => (
                            <span
                              key={tag}
                              className="theme-caption text-forest px-2.5 py-1 rounded-full border border-forest/20 bg-forest/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 group-hover:text-forest transition-colors leading-tight tracking-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="theme-body text-muted mb-4 line-clamp-2">
                        {featuredPost.description}
                      </p>
                      <time className="theme-secondary">
                        {new Date(featuredPost.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </article>
                </Link>
              )}

              {/* Grid of other posts */}
              {otherPosts.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {otherPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <article>
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-foreground/5 mb-4">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-forest/20 to-forest/5" />
                          )}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="theme-caption text-forest px-2.5 py-1 rounded-full border border-forest/20 bg-forest/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h3 className="font-display text-lg md:text-xl text-foreground mb-2 group-hover:text-forest transition-colors leading-snug tracking-tight">
                          {post.title}
                        </h3>
                        <time className="theme-secondary">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[rgba(0,0,0,0.06)]">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo variant="full" size="sm" />
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
          <div className="mt-8 pt-8 border-t border-[rgba(0,0,0,0.06)] text-center">
            <p className="theme-caption text-muted">
              &copy; {new Date().getFullYear()} Flourish. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
