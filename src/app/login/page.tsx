import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Journal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in or create an account to continue
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {/* We will add the Magic Link form here later */}
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
