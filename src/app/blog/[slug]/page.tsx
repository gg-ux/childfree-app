import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { BlogImage } from "@/components/ui/blog-image";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx-components";
import { ArrowLeft, CalendarBlank, Clock } from "@phosphor-icons/react/dist/ssr";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Chosn" };
  }

  return {
    title: `${post.title} | Chosn Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="md" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="theme-nav text-foreground hover:text-muted"
            >
              Blog
            </Link>
            <Button asChild variant="accent" size="md">
              <Link href="/sign-up">Join waitlist</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="pt-28 pb-16 md:pt-36 md:pb-24">
        {/* Back link */}
        <div className="container-main mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 theme-body-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>

        {/* Header - centered */}
        <header className="max-w-3xl mx-auto px-6 mb-10 md:mb-12">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
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

          <h1 className="font-display text-fluid-h2 text-foreground mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 theme-secondary">
            <span className="font-semibold text-foreground">{post.author}</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <CalendarBlank size={14} />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Featured image */}
        {post.image && (
          <div className="max-w-3xl mx-auto px-6 mb-10 md:mb-12">
            <div className="aspect-[3/2] rounded-2xl overflow-hidden bg-foreground/5">
              <BlogImage
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content - centered, narrower */}
        <div className="max-w-3xl mx-auto px-6">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-foreground/[0.02]">
        <div className="container-main text-center">
          <h2 className="font-display text-fluid-h3 text-foreground mb-4 tracking-tight">
            Ready to find your people?
          </h2>
          <p className="theme-body text-muted mb-8">
            Join the waitlist and be the first to know when we launch.
          </p>
          <Button asChild variant="accent" size="lg">
            <Link href="/sign-up" className="gap-2">
              Join waitlist
            </Link>
          </Button>
        </div>
      </section>

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
          <div className="mt-8 pt-8 border-t border-[rgba(0,0,0,0.06)] text-center">
            <p className="theme-caption text-muted">
              &copy; {new Date().getFullYear()} Chosn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
