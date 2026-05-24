import { loginWithGoogle } from "../../actions/auth";

export default function GoogleSignInButton() {
  return (
    <form action={loginWithGoogle}>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Sign in with Google
      </button>
    </form>
  );
}
