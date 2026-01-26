import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogImage } from "@/components/ui/blog-image";
import {
  Heart,
  Users,
  CalendarBlank,
  ShieldCheck,
  ArrowRight,
  MagnifyingGlass,
  ShootingStar,
  Dog,
  AirplaneTilt,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Logo } from "@/components/ui/logo";
import { TextDecode } from "@/components/ui/text-decode";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import { ProfileCards } from "@/components/ui/profile-cards";
import { ChatSurvey } from "@/components/ui/chat-survey";

export default async function Home() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 5);
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

      {/* Hero Section - Option A: Floating Profile Cards */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative z-30">
              <p className="theme-caption text-foreground mb-6 inline-flex items-center gap-2">
                <ShootingStar size={16} weight="fill" className="text-marigold" />
                Launching mid 2026
              </p>

              <h1 className="font-display text-fluid-h1 text-foreground mb-6 leading-[0.9] tracking-tight">
                <span className="whitespace-nowrap">Find your people.</span>
                <br />
                <span className="whitespace-nowrap">Thrive childfree.</span>
              </h1>

              <p className="theme-body text-muted max-w-2xl mb-10">
                Connect with childfree adults who share your values. Make friends, find love, and build community all in one place.
              </p>

              <WaitlistForm source="hero" />
            </div>

            {/* Floating Profile Cards */}
            <ProfileCards />
          </div>
        </div>
      </section>

      {/* Hero Section - Option B: Photo Collage (alternative) */}
      {/*
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="theme-caption text-foreground mb-6 inline-flex items-center gap-2">
                <ShootingStar size={16} weight="fill" className="text-marigold" />
                Launching mid 2026
              </p>

              <h1 className="font-display text-fluid-h1 text-foreground mb-6 leading-[0.9] tracking-tight">
                Find your people.
                <br />
                Thrive childfree.
              </h1>

              <p className="theme-body text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                The modern platform for childfree adults seeking meaningful
                connections—whether that&apos;s romance, friendship, or your chosen
                family.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="accent">
                  <Link href="/sign-up">
                    Join waitlist
                    <ArrowRight size={13} weight="bold" className="ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#how-it-works">Learn more</Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[500px] hidden md:block">
              <div className="absolute top-0 left-8 w-48 h-64 rounded-2xl bg-gradient-to-br from-forest/10 to-forest/5 border border-border -rotate-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  <p className="theme-caption">Photo 1</p>
                </div>
              </div>
              <div className="absolute top-12 right-4 w-56 h-72 rounded-2xl bg-gradient-to-br from-coral/10 to-coral/5 border border-border rotate-3 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  <p className="theme-caption">Photo 2</p>
                </div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 h-52 rounded-2xl bg-gradient-to-br from-marigold/10 to-marigold/5 border border-border rotate-1 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  <p className="theme-caption">Photo 3</p>
                </div>
              </div>
              <div className="absolute bottom-24 left-0 w-32 h-32 rounded-xl bg-gradient-to-br from-cream/30 to-cream/10 border border-border -rotate-3 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted">
                  <p className="text-xs">Photo 4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Stats Section */}
      <section className="py-16 border-y border-[rgba(0,0,0,0.06)]">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "60M+", label: "Childfree adults in the U.S." },
              { value: "1 in 5", label: "Childfree by choice" },
              { value: "47%", label: "Childless adults under 50 staying childfree" },
              { value: "+15%", label: "More childfree adults since 2002" },
            ].map((stat, index) => (
              <div key={stat.label}>
                <div className="theme-stat text-3xl md:text-4xl text-foreground mb-2 whitespace-nowrap">
                  <TextDecode
                    text={stat.value}
                    speed={25}
                    iterations={3}
                    delay={index * 100}
                  />
                </div>
                <div className="theme-caption text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container-main">
          <div className="max-w-2xl mb-16">
            <h2 className="font-display text-fluid-h2 text-foreground mb-6 leading-[0.9] tracking-tight">
              More than a dating app.
            </h2>
            <p className="theme-body text-muted">
              Match with locals or connect online—whether you&apos;re looking for love, a travel partner, a best man, or soul&nbsp;sisters.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Heart,
                title: "Dating",
                description:
                  "Find someone who shares your values. No more awkward conversations.",
                iconColor: "text-[#b8502a]",
                bg: "bg-coral/15",
              },
              {
                icon: Users,
                title: "Friendship",
                description:
                  "Connect with others who get it. Build your chosen family.",
                iconColor: "text-[#1e5a3a]",
                bg: "bg-forest/15",
              },
              {
                icon: CalendarBlank,
                title: "Events",
                description:
                  "Join local meetups, virtual hangouts, and community gatherings.",
                iconColor: "text-[#b07c1a]",
                bg: "bg-marigold/15",
              },
              {
                icon: ShieldCheck,
                title: "Verified",
                description:
                  "Every profile is human-reviewed. Real people, real connections.",
                iconColor: "text-[#2d2438]",
                bg: "bg-[#19131D]/10",
              },
            ].map((feature) => (
              <FrostedCard key={feature.title} className="p-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon
                    size={26}
                    weight="duotone"
                    className={`${feature.iconColor}`}
                  />
                </div>
                <h3 className="theme-heading text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="theme-body-sm text-muted">
                  {feature.description}
                </p>
              </FrostedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section className="py-20 md:py-28 bg-foreground/[0.02]">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-fluid-h2 text-foreground mb-6 leading-[0.9] tracking-tight">
                Help us get this right.
              </h2>
              <p className="theme-body text-muted mb-4">
                We&apos;re building Chosn with our community, not just for them. Tell us what matters most to you—your answers are anonymous, but your voice will shape everything we build.
              </p>
              <p className="theme-body-sm text-muted">
                Takes about 2 minutes.
              </p>
            </div>
            <ChatSurvey />
          </div>
        </div>
      </section>

      {/* Chosen Family Section - merged emotional section */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-[45%_1fr] gap-8 lg:gap-10 items-center">
            {/* Group image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="/assets/home/group01.webp"
                alt="Friends enjoying time together"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Text content */}
            <div>
              <h2 className="font-display text-fluid-h2 text-foreground mb-6 leading-[0.9] tracking-tight">
                Your chosen <span className="whitespace-nowrap">family awaits.</span>
              </h2>
              <p className="theme-body text-muted">
                You made the bold choice to follow your own path and live differently. You&apos;re not alone. Connect with people who get it from day one. Whether you&apos;re looking for your person, people, or place—you&apos;ll find a community that celebrates the life you&apos;re building. Not all family is related by blood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Teaser Section */}
      {recentPosts.length > 0 && (
        <section className="py-20 md:py-28 border-t border-[rgba(0,0,0,0.06)]">
          <div className="container-main flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-fluid-h2 text-foreground mb-3 leading-[0.9] tracking-tight">
                While you wait
              </h2>
              <p className="theme-body text-muted">
                Stories and resources for the childfree life.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-1 theme-body-sm text-muted hover:text-foreground transition-colors"
            >
              See all
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pl-6 md:pl-12 lg:pl-20">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex-shrink-0 w-[280px] md:w-[320px]"
                >
                  <div className="aspect-[3/2] rounded-xl overflow-hidden bg-foreground/5 mb-4">
                    {post.image ? (
                      <BlogImage
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-forest/20 to-forest/5" />
                    )}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="theme-caption text-forest px-2 py-0.5 rounded-full border border-forest/20 bg-forest/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-display text-lg text-foreground group-hover:text-muted transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="theme-body-sm text-muted mt-1">
                    {post.readingTime}
                  </p>
                </Link>
              ))}
              {/* Spacer: container padding minus gap (gap is already added before this) */}
              <div className="flex-shrink-0 w-0 md:w-6 lg:w-14" aria-hidden="true" />
            </div>
          </div>
          <div className="container-main mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 theme-body-sm text-muted hover:text-foreground transition-colors"
            >
              See all
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-fluid-h2 text-foreground mb-6 leading-[0.9] tracking-tight">
              Be part of <span className="whitespace-nowrap">something new.</span>
            </h2>
            <p className="theme-body text-muted mb-10">
              We&apos;re building the community that should have existed years ago. Get early access and help shape&nbsp;it.
            </p>

            <WaitlistForm source="cta" className="mx-auto" />

            <p className="theme-caption text-muted mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[rgba(0,0,0,0.06)]">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo variant="full" size="md" />
            <div className="flex items-center gap-8">
              {["About", "Privacy", "Terms"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="theme-caption text-muted hover:text-foreground transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
              <a
                href="mailto:hello@chosn.co"
                className="theme-caption text-muted hover:text-foreground transition-colors duration-300"
              >
                Contact
              </a>
              <div className="flex items-center gap-4 ml-2">
                <a
                  href="https://www.instagram.com/chosn.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.pinterest.com/chosn_hq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors duration-300"
                  aria-label="Pinterest"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
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
