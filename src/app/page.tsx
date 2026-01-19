import Link from "next/link";
import {
  Heart,
  Users,
  CalendarBlank,
  ShieldCheck,
  ArrowRight,
  MagnifyingGlass,
  ShootingStar,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { FrostedCard } from "@/components/ui/frosted-card";
import { Logo } from "@/components/ui/logo";
import { TextDecode } from "@/components/ui/text-decode";
import { WaitlistForm } from "@/components/ui/waitlist-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="sm" />
          </Link>
          <Button asChild size="sm" variant="accent">
            <Link href="/sign-up">Join waitlist</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section - Option A: Floating Profile Cards */}
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
                Connect with childfree adults who share your values. Make friends, find love, and build community all in one place.
              </p>

              <WaitlistForm source="hero" />
            </div>

            {/* Floating Profile Cards */}
            <div className="relative h-[280px] md:h-[400px] lg:h-[500px]">
              {/* Card 2 - Left (behind) */}
              <div className="absolute top-16 md:top-24 left-0 md:left-4 w-32 md:w-48 bg-white rounded-2xl shadow-lg border border-border overflow-hidden -rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
                <div className="aspect-[3/4] bg-gradient-to-br from-coral/20 to-coral/5 flex items-center justify-center">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-full bg-coral/20 flex items-center justify-center">
                    <Heart size={20} className="text-coral md:hidden" />
                    <Heart size={24} className="text-coral hidden md:block" />
                  </div>
                </div>
                <div className="p-2 md:p-3">
                  <p className="font-medium text-foreground text-xs md:text-sm">Alex, 27</p>
                  <p className="text-[10px] md:text-xs text-muted mb-1 md:mb-2">3 miles away</p>
                  <div className="flex flex-wrap gap-1 hidden md:flex">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
                      <MagnifyingGlass size={10} weight="bold" />
                      Chosen family
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3 - Right (behind) */}
              <div className="absolute top-16 md:top-24 right-0 md:right-4 w-32 md:w-48 bg-white rounded-2xl shadow-lg border border-border overflow-hidden rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
                <div className="aspect-[3/4] bg-gradient-to-br from-marigold/20 to-marigold/5 flex items-center justify-center">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-full bg-marigold/20 flex items-center justify-center">
                    <CalendarBlank size={20} className="text-marigold md:hidden" />
                    <CalendarBlank size={24} className="text-marigold hidden md:block" />
                  </div>
                </div>
                <div className="p-2 md:p-3">
                  <p className="font-medium text-foreground text-xs md:text-sm">Jordan, 38</p>
                  <p className="text-[10px] md:text-xs text-muted mb-1 md:mb-2">8 miles away</p>
                  <div className="flex flex-wrap gap-1 hidden md:flex">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
                      <MagnifyingGlass size={10} weight="bold" />
                      Travel partner
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 1 - Main (front) */}
              <div className="absolute top-4 md:top-12 left-1/2 -translate-x-1/2 w-40 md:w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden hover:scale-[1.02] transition-transform duration-500 z-20">
                <div className="aspect-[3/4] bg-gradient-to-br from-forest/20 to-forest/5 flex items-center justify-center relative">
                  <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-forest/20 flex items-center justify-center">
                    <Users size={22} className="text-forest md:hidden" />
                    <Users size={28} className="text-forest hidden md:block" />
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <p className="font-medium text-foreground text-sm md:text-base">Sarah, 52</p>
                  <p className="text-xs md:text-sm text-muted mb-1 md:mb-2">5 miles away</p>
                  <div className="flex flex-wrap gap-1.5 hidden md:flex">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
                      <MagnifyingGlass size={10} weight="bold" />
                      DINK partner
                    </span>
                  </div>
                </div>
              </div>

              {/* Connection lines - subtle */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" viewBox="0 0 400 500">
                <path d="M200 100 Q 100 200 80 280" stroke="#2F7255" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                <path d="M200 100 Q 300 200 320 280" stroke="#2F7255" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              </svg>
            </div>
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
                    Join the waitlist
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
              <div className="absolute bottom-24 left-0 w-32 h-32 rounded-xl bg-gradient-to-br from-blush/30 to-blush/10 border border-border -rotate-3 overflow-hidden">
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
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {[
              { value: "60M+", label: "Childfree adults in the US" },
              { value: "1 in 5", label: "US adults are childfree by choice" },
              { value: "2x", label: "Growth in 20 years" },
            ].map((stat, index) => (
              <div key={stat.label}>
                <div className="font-display text-3xl md:text-4xl text-foreground mb-2 tracking-tight">
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
            <h2 className="font-display text-fluid-h2 text-foreground mb-6 tracking-tight">
              More than a dating app.
            </h2>
            <p className="theme-body text-muted text-lg md:text-xl leading-relaxed">
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
                iconColor: "text-[#8a6055]",
                bg: "bg-blush/30",
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
                <p className="theme-body text-base text-muted leading-relaxed">
                  {feature.description}
                </p>
              </FrostedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Chosen Family Section - merged emotional section */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image placeholder */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-forest/10 to-forest/5 border border-border flex items-center justify-center">
              <p className="theme-caption text-muted">Image</p>
            </div>
            {/* Text content */}
            <div>
              <h2 className="font-display text-fluid-h2 text-foreground mb-6 tracking-tight">
                A family you choose.
              </h2>
              <p className="theme-body text-muted text-lg md:text-xl leading-relaxed">
                Skip the explanations. Connect with people who get it from day one. Whether you&apos;re looking for your person, your people, or your place—you&apos;ll find a community that celebrates the life you&apos;re building. Family isn&apos;t just those related by blood—it&apos;s those who choose to show&nbsp;up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Floating dandelion seeds */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-8 left-[10%] w-6 h-6 text-forest/20 animate-float" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="3" />
            <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg className="absolute top-16 right-[15%] w-5 h-5 text-coral/20 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="3" />
            <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg className="absolute bottom-20 left-[20%] w-4 h-4 text-marigold/20 animate-float" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="3" />
            <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg className="absolute bottom-32 right-[12%] w-5 h-5 text-forest/15 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="3" />
            <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg className="absolute top-1/2 left-[5%] w-4 h-4 text-blush/30 animate-float" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="3" />
            <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg className="absolute top-1/3 right-[8%] w-6 h-6 text-forest/10 animate-float-delayed" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="3" />
            <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="container-main relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-fluid-h2 text-foreground mb-6 tracking-tight">
              Ready to flourish?
            </h2>
            <p className="theme-body text-muted text-lg mb-10">
              Join our waitlist and be the first to know when we launch in your
              city.
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
            <Logo variant="full" size="sm" />
            <div className="flex gap-8">
              {["About", "Privacy", "Terms", "Contact"].map((item) => (
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
