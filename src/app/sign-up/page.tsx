import Link from "next/link";
import { ArrowLeft, Heart, Users, CalendarBlank, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/logo";
import { WaitlistForm } from "@/components/ui/waitlist-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} weight="bold" />
          <span className="theme-caption">Back</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <Logo variant="full" size="md" />
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4 tracking-tight">
            Join the waitlist
          </h1>
          <p className="theme-body text-muted text-lg mb-8">
            Be the first to know when Flourish launches in your city.
          </p>

          {/* Form */}
          <WaitlistForm source="sign-up" />

          {/* Benefits */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="theme-caption text-muted mb-6">What you'll get access to</p>
            <div className="space-y-4">
              {[
                { icon: Heart, text: "Dating with people who share your values" },
                { icon: Users, text: "Friendships and chosen family connections" },
                { icon: CalendarBlank, text: "Local events and virtual hangouts" },
                { icon: ShieldCheck, text: "Verified, human-reviewed profiles" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon size={20} weight="duotone" className="text-forest shrink-0" />
                  <span className="theme-body text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="theme-caption text-muted mt-10">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </main>
    </div>
  );
}
