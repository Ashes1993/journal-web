import { loginWithGoogle } from "../../actions/auth";

export default function GoogleSignInButton() {
  return (
    <form action={loginWithGoogle} className="w-full">
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 
                   text-sm font-semibold text-slate-700 dark:text-slate-200 
                   bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 
                   rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 
                   hover:border-slate-300 dark:hover:border-slate-600 
                   active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
      >
        {/* Accurate inline Google brand asset vector */}
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.21-3.21C17.55 1.62 14.99 1 12 1 7.37 1 3.42 3.66 1.48 7.56l3.8 2.95C6.22 7.02 8.9 5.04 12 5.04z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.45c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.86c2.16-1.99 3.41-4.92 3.41-8.53z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.51c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.48 7.01C.53 8.92 0 11.05 0 13.3s.53 4.38 1.48 6.29l3.8-3.08z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.69-2.86c-1.03.69-2.35 1.1-4.26 1.1-3.1 0-5.78-1.98-6.72-4.92l-3.8 2.95C3.42 20.34 7.37 23 12 23z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>
    </form>
  );
}
