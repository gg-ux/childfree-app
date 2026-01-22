import Link from "next/link";
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

export default function Home() {
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
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {[
              { value: "60M+", label: "Childfree adults in the US" },
              { value: "1 in 5", label: "US adults are childfree by choice" },
              { value: "14% → 29%", label: "Childfree adults since 2002" },
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
                iconColor: "text-[#8a6055]",
                bg: "bg-cream/30",
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

      {/* Chosen Family Section - merged emotional section */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                A family you choose.
              </h2>
              <p className="theme-body text-muted">
                You made the bold choice to follow your own path and live differently. You&apos;re not alone. Connect with people who get it from day one. Whether you&apos;re looking for your person, people, or place—you&apos;ll find a community that celebrates the life you&apos;re building. Not all family is related by blood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-display text-fluid-h2 text-foreground mb-6 leading-[0.9] tracking-tight">
              Ready to connect?
            </h2>
            <p className="theme-body text-muted mb-10">
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
            <Logo variant="full" size="md" />
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
              &copy; {new Date().getFullYear()} Chosn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
