import { logout } from "../../actions/auth";

export default function SignOutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}
