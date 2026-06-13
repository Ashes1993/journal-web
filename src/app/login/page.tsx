import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { BookOpen, ShieldCheck, BarChart3, Calendar } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Log in to your secure, privacy-first Reflect personal journal workspace.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 antialiased">
      {/* Introduction Area */}
      <div className="flex-1 lg:col-span-7 xl:col-span-8 p-6 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-white/40 dark:bg-slate-900/20 border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-slate-800/50">
        {/* Subtle decorative background grid layout */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

        {/* Desktop Header Component */}
        <div className="hidden lg:flex items-center gap-2.5 relative z-10">
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Reflect
          </span>
        </div>

        {/* Value Proposition Framing */}
        <div className="max-w-xl space-y-6 lg:my-auto pt-4 lg:pt-0 relative z-10">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              A private space designed for your thoughts.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Reflect combines minimalist execution with absolute server-side
              cryptographic data isolation, providing a clean environment to
              record your personal narrative.
            </p>
          </div>

          {/* Responsive Feature Framework Grid */}
          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-5 pt-2 lg:space-y-4 sm:gap-4 lg:grid-flow-row">
            <div className="flex gap-3 bg-white/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/40 shadow-2xs">
              <div className="text-indigo-500 mt-0.5 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Zero-Knowledge Storage
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal hidden sm:block lg:block">
                  Entries are AES-256-GCM encrypted before writing to disk.
                </p>
              </div>
            </div>

            <div className="flex gap-3 bg-white/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/40 shadow-2xs">
              <div className="text-emerald-500 mt-0.5 shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Mood Analytics
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal hidden sm:block lg:block">
                  Visualize cyclical trends safely without metric profiling
                  tracking pixels.
                </p>
              </div>
            </div>

            <div className="flex gap-3 bg-white/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/40 shadow-2xs">
              <div className="text-amber-500 mt-0.5 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Interactive Timeline
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal hidden sm:block lg:block">
                  Map historic logs through calendar matrix interfaces
                  seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Micro-footer display notation */}
        <div className="hidden lg:block text-xs font-medium text-slate-400 dark:text-slate-500 relative z-10">
          &copy; {new Date().getFullYear()} Reflect Platform. Cryptographically
          Secured Workspace.
        </div>
      </div>

      {/* Primary Interaction Interface Column */}
      <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xs border border-slate-200/80 dark:border-slate-800/60 transition-all flex flex-col justify-between min-h-[380px]">
          {/* Brand/Identity Display header area */}
          <div className="text-center space-y-3 mt-2">
            <div className="inline-flex lg:hidden bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50 shadow-2xs mx-auto mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Open Your Journal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto leading-relaxed">
              Sign in to securely access your private thoughts, moods, and
              reflections.
            </p>
          </div>

          {/* Primary Authentication Controller Elements */}
          <div className="my-auto py-6">
            <GoogleSignInButton />
          </div>

          {/* Consent validation blocks */}
          <div className="space-y-4">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="text-slate-600 font-bold dark:text-slate-400 hover:underline hover:text-indigo-500 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-slate-600 font-bold dark:text-slate-400 hover:underline hover:text-indigo-500 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* Legal Links Footer Grid block layout references */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-center gap-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
              <Link
                href="/privacy"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <span
                className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800"
                aria-hidden="true"
              />
              <Link
                href="/terms"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
