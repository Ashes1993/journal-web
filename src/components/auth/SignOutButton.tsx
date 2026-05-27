import { logout } from "../../actions/auth";

export default function SignOutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full bg-red-500 rounded-2xl p-2 text-center text-sm font-medium text-white hover:text-red-600 transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}
