import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Terms of Service | Chosn",
  description: "Terms of Service for Chosn - the community platform for childfree adults.",
};

export default function TermsPage() {
  const lastUpdated = "January 23, 2026";

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
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-28 pb-20">
        <div className="container-main">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-display text-fluid-h1 text-foreground mb-4 leading-[0.9] tracking-tight">
              Terms of Service
            </h1>
            <p className="theme-body text-muted text-lg mb-12">
              Last updated: {lastUpdated}
            </p>

            {/* Introduction */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 leading-tight tracking-tight">
                Agreement to Terms
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Welcome to Chosn. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, mobile application, and services (collectively, the &quot;Services&quot;). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                If you do not agree to these Terms, please do not use our Services. We may update these Terms from time to time, and your continued use of the Services after any changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Description of Service */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Description of Service
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Chosn is a community platform designed for childfree adults to connect, share experiences, and build meaningful relationships. Our Services may include community features, messaging, events, content, and other features we develop over time.
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time, with or without notice.
              </p>
            </section>

            {/* Eligibility */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Eligibility
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                You must be at least 18 years old to use our Services. By using Chosn, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
              </p>
            </section>

            {/* User Accounts */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                User Accounts
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                To access certain features, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">Providing accurate and complete information</li>
                <li className="theme-body leading-relaxed">Maintaining the security of your account credentials</li>
                <li className="theme-body leading-relaxed">All activities that occur under your account</li>
                <li className="theme-body leading-relaxed">Notifying us immediately of any unauthorized access</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
              </p>
            </section>

            {/* User Conduct */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                User Conduct
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Chosn is built on mutual respect. When using our Services, you agree not to:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">Harass, bully, threaten, or intimidate other users</li>
                <li className="theme-body leading-relaxed">Post content that is hateful, discriminatory, or promotes violence</li>
                <li className="theme-body leading-relaxed">Impersonate others or misrepresent your identity</li>
                <li className="theme-body leading-relaxed">Share spam, scams, or misleading content</li>
                <li className="theme-body leading-relaxed">Attempt to access other users&apos; accounts or private information</li>
                <li className="theme-body leading-relaxed">Use the Services for any illegal purpose</li>
                <li className="theme-body leading-relaxed">Interfere with or disrupt the Services or servers</li>
                <li className="theme-body leading-relaxed">Scrape, collect, or harvest user data without permission</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We reserve the right to remove content and terminate accounts that violate these guidelines.
              </p>
            </section>

            {/* User Content */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                User Content
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                You retain ownership of any content you post, upload, or share through our Services (&quot;User Content&quot;). By posting User Content, you grant Chosn a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with operating and improving our Services.
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                You are solely responsible for your User Content and represent that you have all necessary rights to share it.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Intellectual Property
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                The Chosn name, logo, website design, and all related content, features, and functionality are owned by Chosn and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from our materials without our express written permission.
              </p>
            </section>

            {/* Disclaimers */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Disclaimers
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Our Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Services will be uninterrupted, secure, or error-free.
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We are not responsible for the conduct of any user, whether online or offline. We do not screen users or verify their identities, and you interact with other users at your own risk.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Limitation of Liability
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                To the maximum extent permitted by law, Chosn and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services, even if we have been advised of the possibility of such damages.
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Our total liability for any claims arising from or related to the Services shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Indemnification
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                You agree to indemnify and hold harmless Chosn and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney fees) arising from your use of the Services, your User Content, or your violation of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Termination
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                You may stop using our Services at any time. We may suspend or terminate your access to the Services at any time, for any reason, including if we believe you have violated these Terms.
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Upon termination, your right to use the Services will immediately cease. Provisions of these Terms that by their nature should survive termination will survive.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Governing Law
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Services shall be resolved in the courts located in California.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Changes to These Terms
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We may revise these Terms from time to time. If we make material changes, we will notify you by posting the updated Terms on our website and updating the &quot;Last updated&quot; date. Your continued use of the Services after changes are posted constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Contact Us
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-foreground/5 rounded-xl p-6">
                <p className="theme-body text-foreground font-semibold mb-2">Chosn</p>
                <p className="theme-body text-muted mb-2">
                  Email: <Link href="mailto:hello@chosn.co" className="text-forest underline underline-offset-2 hover:text-forest/80 transition-colors">hello@chosn.co</Link>
                </p>
                <p className="theme-body text-muted">
                  Website: <Link href="https://chosn.co" className="text-forest underline underline-offset-2 hover:text-forest/80 transition-colors">chosn.co</Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

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
                    item === "Terms" ? "text-foreground" : "text-muted"
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
