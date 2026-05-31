import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xs border border-slate-200/80 dark:border-slate-800/60 transition-all flex flex-col justify-between min-h-[340px]">
        {/* Branding Header Area */}
        <div className="text-center space-y-4">
          <div className="inline-flex bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50 shadow-2xs mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Open Your Journal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto leading-relaxed">
              Sign in to securely access your private thoughts, moods, and
              reflections.
            </p>
          </div>
        </div>

        {/* Primary Call To Action */}
        <div className="my-auto pt-6">
          <GoogleSignInButton />
        </div>

        {/* Ensure the user is agreeing to the terms by clicking on the sign in button */}
        <p className="text-xs mb-5 text-slate-500 dark:text-slate-400 text-center">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="text-slate-600 font-bold dark:text-slate-300 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-slate-600 font-bold dark:text-slate-300 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* Legal Link Footer Block */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-center gap-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
          <Link
            href="/privacy"
            className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <span
            className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"
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
  );
}
