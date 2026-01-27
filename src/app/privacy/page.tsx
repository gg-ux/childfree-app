import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Privacy Policy | Chosn",
  description: "Privacy Policy for Chosn - the community platform for childfree adults.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="theme-body text-muted text-lg mb-12">
              Last updated: {lastUpdated}
            </p>

            {/* Introduction */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 leading-tight tracking-tight">
                Introduction
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Welcome to Chosn (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring you understand how we collect, use, and safeguard your personal information. This Privacy Policy explains our practices regarding data collection and use when you use our website, mobile application, and services (collectively, the &quot;Services&quot;).
              </p>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                By using our Services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Information We Collect
              </h2>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                Information You Provide Directly
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                When you create an account, join our waitlist, or use our Services, we may collect:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Account Information:</span> Name, email address, password, date of birth, and profile photo</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Profile Information:</span> Bio, interests, location (city/region), preferences, and other information you choose to share</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Communications:</span> Messages you send to other users, support requests, and feedback</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Waitlist Information:</span> Email address and optional location when you join our waitlist</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Payment Information:</span> If you make purchases, we collect billing details (processed securely by third-party payment processors)</li>
              </ul>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                Information Collected Automatically
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                When you access our Services, we automatically collect certain information:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Device Information:</span> Device type, operating system, unique device identifiers, and mobile network information</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Log Information:</span> Access times, pages viewed, IP address, and the page you visited before navigating to our Services</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Location Information:</span> General location based on IP address; precise location only with your explicit consent</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Usage Information:</span> Features you use, actions you take, and how you interact with our Services</li>
              </ul>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                Information from Third Parties
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We may receive information about you from third parties, including:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Social Media Platforms:</span> If you sign up using Google, Apple, or other social login providers, we receive basic profile information as permitted by your privacy settings</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Connected Services:</span> If you connect third-party services like Pinterest to share content, we access only the information necessary to provide that functionality</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Analytics Providers:</span> We may receive aggregated analytics data from third-party services</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                How We Use Your Information
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Provide and Improve Services:</span> Create and manage your account, facilitate connections with other users, and improve our platform</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Personalize Your Experience:</span> Show relevant profiles, content, and recommendations based on your preferences</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Communications:</span> Send you updates, security alerts, support messages, and marketing communications (with your consent)</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Safety and Security:</span> Detect and prevent fraud, abuse, and security incidents; verify user identities; enforce our terms</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Analytics:</span> Understand how users interact with our Services to improve functionality and user experience</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Legal Compliance:</span> Comply with applicable laws, regulations, and legal processes</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Third-Party Services and Integrations
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Our Services integrate with various third-party platforms and services:
              </p>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                Pinterest Integration
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                If you connect your Pinterest account to share content from Chosn:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">We access your Pinterest boards and the ability to create pins on your behalf</li>
                <li className="theme-body leading-relaxed">We only post content that you explicitly choose to share</li>
                <li className="theme-body leading-relaxed">We do not access your Pinterest messages, followers, or other personal data</li>
                <li className="theme-body leading-relaxed">You can disconnect Pinterest at any time in your account settings</li>
                <li className="theme-body leading-relaxed">Pinterest&apos;s own privacy policy governs their use of your data: <Link href="https://policy.pinterest.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-2 hover:text-forest/80 transition-colors">pinterest.com/privacy</Link></li>
              </ul>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                Authentication Providers
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                When you sign in with Google or Apple:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">We receive only basic profile information (name, email, profile photo)</li>
                <li className="theme-body leading-relaxed">We do not access your contacts, calendars, or other account data</li>
                <li className="theme-body leading-relaxed">You can revoke access at any time through your Google/Apple account settings</li>
              </ul>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                Analytics and Advertising
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Analytics:</span> To understand usage patterns and improve our Services</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Error Tracking:</span> To identify and fix technical issues</li>
                <li className="theme-body leading-relaxed">These services may collect information sent by your browser or device</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                How We Share Your Information
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">With Other Users:</span> Your profile information is visible to other users as part of the core functionality of our platform</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Service Providers:</span> We share data with vendors who help us operate our Services (hosting, email, analytics), under strict confidentiality agreements</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Legal Requirements:</span> When required by law, subpoena, or legal process, or to protect rights, safety, or property</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets, with notice to you</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">With Your Consent:</span> When you explicitly authorize sharing with third parties</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Cookies and Tracking Technologies
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Essential Cookies:</span> Required for basic functionality like authentication and security</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Preference Cookies:</span> Remember your settings and preferences</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Analytics Cookies:</span> Understand how you use our Services</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Marketing Cookies:</span> Deliver relevant advertisements (only with your consent)</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                You can control cookies through your browser settings. Note that disabling certain cookies may limit functionality.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Data Retention
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">Provide our Services to you</li>
                <li className="theme-body leading-relaxed">Comply with legal obligations</li>
                <li className="theme-body leading-relaxed">Resolve disputes and enforce agreements</li>
                <li className="theme-body leading-relaxed">Maintain security and prevent fraud</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Your Rights and Choices
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Access:</span> Request a copy of your personal information</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Correction:</span> Update or correct inaccurate information</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Deletion:</span> Request deletion of your personal information</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Portability:</span> Receive your data in a structured, machine-readable format</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Opt-Out:</span> Unsubscribe from marketing communications</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Restrict Processing:</span> Limit how we use your data in certain circumstances</li>
                <li className="theme-body leading-relaxed"><span className="font-semibold text-foreground">Withdraw Consent:</span> Revoke consent where processing is based on consent</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                To exercise these rights, contact us at <Link href="mailto:hello@chosn.co" className="text-forest underline underline-offset-2 hover:text-forest/80 transition-colors">hello@chosn.co</Link>. We will respond within 30 days.
              </p>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                California Residents (CCPA)
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                California residents have additional rights under the California Consumer Privacy Act, including the right to know what personal information we collect, request deletion, and opt-out of sales. We do not sell personal information.
              </p>

              <h3 className="font-semibold text-xl text-foreground mb-3 mt-8">
                European Residents (GDPR)
              </h3>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                If you are in the European Economic Area, you have rights under the General Data Protection Regulation including access, rectification, erasure, restriction, portability, and the right to lodge a complaint with a supervisory authority.
              </p>
            </section>

            {/* Security */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Data Security
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">Encryption of data in transit (TLS/SSL) and at rest</li>
                <li className="theme-body leading-relaxed">Regular security assessments and penetration testing</li>
                <li className="theme-body leading-relaxed">Access controls and authentication requirements</li>
                <li className="theme-body leading-relaxed">Employee training on data protection</li>
                <li className="theme-body leading-relaxed">Incident response procedures</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Children&apos;s Privacy
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Our Services are intended for adults aged 18 and older. We do not knowingly collect personal information from anyone under 18. If we become aware that we have collected data from someone under 18, we will delete it promptly. If you believe we have information about a minor, please contact us immediately.
              </p>
            </section>

            {/* International Transfers */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                International Data Transfers
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, such as standard contractual clauses, to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            {/* Changes */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Changes to This Policy
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted text-lg">
                <li className="theme-body leading-relaxed">Posting the new policy on this page with an updated &quot;Last Updated&quot; date</li>
                <li className="theme-body leading-relaxed">Sending you an email notification for significant changes</li>
                <li className="theme-body leading-relaxed">Displaying a notice in our app</li>
              </ul>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 mt-10 leading-tight tracking-tight">
                Contact Us
              </h2>
              <p className="theme-body text-muted text-lg leading-relaxed mb-6">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
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
                    item === "Privacy" ? "text-foreground" : "text-muted"
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
