import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Operational framework guidelines, system limitations, and service parameters governing the Reflect application ecosystem.",
  robots: { index: false, follow: true },
};

export default function TermsOfUsePage() {
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
              <Scale className="w-4 h-4" /> Operational Agreement
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Terms of Use Agreement
            </h1>
            <p className="text-xs text-slate-400">Effective Date: June 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Core Acceptance of Framework Parameters
            </h2>
            <p>
              By accessing, creating records inside, or authenticating into the
              Reflect system application framework, you acknowledge that you
              have read and implicitly consent to be legally bound by these
              operations parameters. If you disagree with any segment, access
              permission must be self-rescinded.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Authentication Control & Account Security
            </h2>
            <p>
              Reflect utilizes Google OAuth parameters to handle authentication
              securely without requiring password profiles. You are solely
              responsible for protecting the master credentials to your
              third-party Google Account profiles. Reflect cannot be held
              responsible for security exploits resulting from compromised
              authentication states.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Acceptable Use Guidelines
            </h2>
            <p>
              As a private journal system, your entries are isolated from
              external networks and social feeds. However, you agree not to
              exploit the platform framework through automated network stress
              attacks, scrapers, database injection scripts, or payloads
              designed to disrupt service continuity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Service Terms & Liability Disclaimers
            </h2>
            <p>
              Reflect is provided on an {'"'}as-is{'"'} and {'"'}as-available
              {'"'} architecture. While we apply symmetric server-side
              encryption arrays to block database-level compromises, we cannot
              guarantee absolute resilience against local device key extraction,
              endpoint security vulnerabilities, or infrastructure network
              outages.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
