import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import SignOutButton from "./auth/SignOutButton";

interface SideBarProps {
  user: Session["user"] | null;
}

export default function SideBar({ user }: SideBarProps) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/calendar", label: "Calendar" },
    { href: "/profile", label: "Profile" },
  ];
  return (
    <aside className="w-1/4 flex flex-col border border-gray-400 rounded-2xl shadow-2xl shadow-gray-400 p-4 mr-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <nav className="flex flex-col">
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              href={link.href}
              className="mb-2 w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-400 mb-2">
              <Image
                src={user.image || "/default-avatar.png"}
                alt={user.name || "User Avatar"}
                width={40}
                height={40}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <p className="text-lg text-gray-600">{user.name}</p>
            <SignOutButton />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not logged in</p>
        )}
      </div>
    </aside>
  );
}
