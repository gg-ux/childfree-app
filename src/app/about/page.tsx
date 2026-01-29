import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ProtectedImage } from "@/components/ui/protected-image";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import {
  Heart,
  UsersThree,
  MagnifyingGlass,
  UsersFour,
  HourglassMedium,
  Eye,
} from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "About | Chosn",
  description:
    "Chosn is the first platform designed entirely for childfree adults. Find your people, your city, and your community.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          {/* Mobile: logo + links grouped on left */}
          <div className="flex items-center gap-4 sm:hidden">
            <Link href="/" className="flex-shrink-0">
              <Logo variant="full" size="md" />
            </Link>
            <Link href="/about" className="theme-nav text-foreground hover:text-muted">
              About
            </Link>
            <Link href="/blog" className="theme-nav text-foreground hover:text-muted">
              Blog
            </Link>
          </div>
          {/* Desktop: logo on left */}
          <Link href="/" className="hidden sm:block flex-shrink-0">
            <Logo variant="full" size="md" />
          </Link>
          {/* Desktop: links + button grouped on right */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/about" className="theme-nav text-foreground hover:text-muted">
              About
            </Link>
            <Link href="/blog" className="theme-nav text-foreground hover:text-muted">
              Blog
            </Link>
            <Button asChild variant="accent" size="md">
              <Link href="/sign-up">Join waitlist</Link>
            </Button>
          </div>
          {/* Mobile: button on right */}
          <Button asChild variant="accent" size="md" className="flex-shrink-0 sm:hidden">
            <Link href="/sign-up">Join waitlist</Link>
          </Button>
        </div>
      </nav>

      {/* Hero — invitational, not adversarial */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h1 className="font-display text-fluid-h1 text-foreground leading-[0.9] tracking-tight mb-6">
                Live the life
                <br />
                you chose
              </h1>
              <p className="theme-body text-muted max-w-lg">
                Chosn was born from a simple belief: the best life is one you design on your own terms.
              </p>
            </div>
            <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/assets/about/phone-mockup.svg"
                alt="Chosn app loading screen on a phone mockup"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-center">
            <div className="w-[280px] bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden relative">
                <ProtectedImage
                  src="/assets/bio-pic3.jpg"
                  alt="Grace, founder of Chosn"
                  className="object-cover !relative scale-110 origin-top"
                />
                {/* Bauhaus geometric overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 280 373" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Quarter circle — top-left corner */}
                    <path d="M0 0 L0 90 A90 90 0 0 0 90 0 Z" fill="#2F7255" opacity="0.4"/>
                    {/* Quarter circle — bottom-right corner */}
                    <path d="M280 373 L280 293 A80 80 0 0 0 200 373 Z" fill="#D4654A" opacity="0.35"/>
                    {/* Concentric arcs — bottom-left */}
                    <g transform="translate(0, 373)">
                      <path d="M0 0 A120 120 0 0 1 120 0" fill="none" stroke="#D9A441" strokeWidth="3" opacity="0.45" transform="rotate(-90)"/>
                      <path d="M0 0 A85 85 0 0 1 85 0" fill="none" stroke="#D9A441" strokeWidth="2.5" opacity="0.35" transform="rotate(-90)"/>
                      <path d="M0 0 A50 50 0 0 1 50 0" fill="none" stroke="#D9A441" strokeWidth="2" opacity="0.25" transform="rotate(-90)"/>
                    </g>
                    {/* Dot grid — top-right area */}
                    <g fill="#F5F0E8" opacity="0.4">
                      <circle cx="200" cy="10" r="2.5"/><circle cx="218" cy="10" r="2.5"/><circle cx="236" cy="10" r="2.5"/><circle cx="254" cy="10" r="2.5"/>
                      <circle cx="200" cy="28" r="2.5"/><circle cx="218" cy="28" r="2.5"/><circle cx="236" cy="28" r="2.5"/><circle cx="254" cy="28" r="2.5"/>
                      <circle cx="200" cy="46" r="2.5"/><circle cx="218" cy="46" r="2.5"/><circle cx="236" cy="46" r="2.5"/><circle cx="254" cy="46" r="2.5"/>
                      <circle cx="200" cy="64" r="2.5"/><circle cx="218" cy="64" r="2.5"/><circle cx="236" cy="64" r="2.5"/><circle cx="254" cy="64" r="2.5"/>
                    </g>
                    {/* Diagonal lines — mid-right */}
                    <g stroke="#F5F0E8" strokeWidth="1.5" opacity="0.25">
                      <line x1="240" y1="140" x2="280" y2="180"/>
                      <line x1="240" y1="155" x2="280" y2="195"/>
                      <line x1="240" y1="170" x2="280" y2="210"/>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-foreground text-base mb-2">Grace, Founder</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
                    <Heart size={11} weight="bold" />
                    Childfree
                  </span>
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
                    <UsersThree size={11} weight="bold" />
                    Community builder
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-fluid-h2 text-foreground leading-[0.9] tracking-tight mb-6">
                Why I built Chosn
              </h2>
              <p className="theme-body text-muted mb-5">
                Hi, I&apos;m Grace. I&apos;ve been childfree my whole life, and that came
                with no shortage of opinions from everyone around me. I
                got tired of the judgment at family
                gatherings and the constant assumption that I&apos;d change
                my mind. As my closest friends disappeared into parenthood,
                I realized childfree adults deserved a real space to find
                connection.
              </p>
              <p className="theme-body text-muted mb-5">
                I built Chosn because it&apos;s the platform I wish I had
                growing up. Dating apps had a &ldquo;don&apos;t want kids&rdquo; filter,
                but nothing exclusively for childfree adults that brought
                together dating, friendships, and ways to build community
                online and offline, while actually feeling modern and
                delightful to use.
              </p>
              <p className="theme-body text-muted mb-5">
                With a master&apos;s in human-computer interaction + design
                and a decade spent designing products at startups and big
                tech, I knew I could build something better. So that&apos;s
                what I&apos;m doing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-12 md:py-16 bg-foreground/[0.02]">
        <div className="container-main">
          <div>
            <h2 className="font-display text-fluid-h2 text-foreground leading-[1.05] tracking-tight mb-3 text-center">
              What we hope to alleviate
            </h2>
            <p className="theme-body text-muted mb-8 text-center">
              These aren&apos;t small things. And they&apos;re easier to navigate when you&apos;re not doing it alone.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: MagnifyingGlass,
                  title: "Finding a partner",
                  description: "Worrying you\u2019ll never find someone who truly shares your values, not just \u201Copen to it\u201D but genuinely childfree.",
                  iconColor: "text-[#1e5a3a]",
                  bg: "bg-forest/15",
                },
                {
                  icon: UsersFour,
                  title: "Losing your circle",
                  description: "Watching your social life shrink as friends enter parenthood and suddenly have nothing in common with you.",
                  iconColor: "text-[#b8502a]",
                  bg: "bg-coral/15",
                },
                {
                  icon: HourglassMedium,
                  title: "Aging alone",
                  description: "The quiet fear of getting older without a built-in support system, and no roadmap for what that looks like.",
                  iconColor: "text-[#b07c1a]",
                  bg: "bg-marigold/15",
                },
                {
                  icon: Eye,
                  title: "Judgment and invisibility",
                  description: "Being called selfish, told you\u2019ll regret it, while living in a world where policies, social norms, and even apps are designed around families.",
                  iconColor: "text-[#1e5a3a]",
                  bg: "bg-forest/15",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-background p-6">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon size={24} weight="duotone" className={item.iconColor} />
                  </div>
                  <h3 className="theme-heading text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="theme-body-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Everything in one place */}
      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-display text-fluid-h2 text-foreground leading-[0.9] tracking-tight mb-6">
                Everything in one place
              </h2>
              <p className="theme-body text-muted mb-5">
                The right community changes everything. When you&apos;re
                surrounded by people who share your values, the weight of
                your struggles is lifted. Your chosen family can bring just
                as much—or even more—connection, joy, and support as
                blood-relatives. Chosn gives you everything you need in
                one place to build a thriving childfree network.
              </p>
              <Link
                href="/#survey"
                className="theme-body-sm text-foreground underline underline-offset-4 hover:text-muted transition-colors"
              >
                Help shape Chosn
              </Link>
            </div>
            <div className="order-1 md:order-2 relative aspect-square max-w-[480px] mx-auto w-full">
              <Image
                src="/assets/about/node-chart.svg"
                alt="Node chart showing Chosn connecting dating, friendship, city guides, events, and resources"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA — warm, inviting */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-fluid-h2 text-foreground leading-[0.9] tracking-tight mb-6">
              Come as you are
            </h2>
            <p className="theme-body text-muted mb-8">
              We&apos;re building Chosn for people like us. Join us early
              and be part of what&apos;s next.
            </p>
            <div className="flex justify-center">
              <WaitlistForm source="about-cta" />
            </div>
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
                  className={`theme-caption hover:text-foreground transition-colors duration-300 ${
                    item === "About" ? "text-foreground" : "text-muted"
                  }`}
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
                  href="https://www.facebook.com/profile.php?id=61587144091146"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
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
