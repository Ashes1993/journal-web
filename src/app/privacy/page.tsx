import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Technical specifications on how the Reflect journal platform secures and isolates your personal cryptographic files.",
  robots: { index: false, follow: true }, // Keeps legal pages clean from bloating main site SEO paths
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Action */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Login
        </Link>

        {/* Content Card Wrapper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-6 md:p-10 shadow-xs space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs tracking-wider uppercase">
              <Shield className="w-4 h-4" /> Security Architecture
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Privacy & Data Protection Policy
            </h1>
            <p className="text-xs text-slate-400">Last Modified: June 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Core Cryptographic Architecture
            </h2>
            <p>
              Reflect is engineered from the ground up as a privacy-first
              platform. Unlike typical web applications that store raw user
              notes directly to databases, Reflect processes all entries through
              an automated **Server-Side Advanced Encryption Standard layer
              (AES-256-GCM)** before writing metadata packets to persistent
              storage.
            </p>
            <p>
              Every entry content stream features an isolated initialization
              vector (IV) alongside individual operational data integrity tags.
              This prevents structural side-channel matching, data tampering,
              and database leaks from displaying your entries in plain text.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Information Collection & Identity Limits
            </h2>
            <p>
              We restrict data acquisition to essential requirements to support
              authenticated identity workflows:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-500 dark:text-slate-400">
              <li>
                <strong>OAuth Profiles:</strong> Primary email addresses and
                system-provided user identification names retrieved strictly via
                secure Google OAuth handshakes.
              </li>
              <li>
                <strong>Platform Content:</strong> User-generated post titles,
                localized calendar timestamps, tags, self-reported mood
                classifications, and ciphertexts.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Third-Party Infrastructure Providers
            </h2>
            <p>
              Data structures map cleanly onto isolated enterprise cloud spaces:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-500 dark:text-slate-400">
              <li>
                <strong>Hosting & Compute:</strong> Application routing states
                execute inside Vercel’s global server edge functions network.
              </li>
              <li>
                <strong>Database Layer:</strong> Encrypted data tables are
                handled through specialized, isolated PostgreSQL cloud databases
                provisioned by Neon.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Absolute User Sovereignty & Rights
            </h2>
            <p>
              You maintain total, uncompromised control over your data. In line
              with global privacy principles (including Western European GDPR
              guidelines), we provide true deletion behaviors. Triggering an
              entry delete completely destroys the reference rows inside our
              database tables. No cached, shadowed, or unencrypted historical
              versions are kept.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
