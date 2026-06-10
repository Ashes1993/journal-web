"use client";

import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { Home, Calendar, User, LayoutDashboard, PieChart } from "lucide-react";
import SignOutButton from "./auth/SignOutButton";
import { usePathname } from "next/navigation";

interface NavProps {
  user: Session["user"] | null;
}

export default function SideBar({ user }: NavProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/insights", label: "Insights", icon: PieChart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-card border-r border-muted-border p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-app-text">
            Journal
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-blue-400" : "text0slate-400"
                  }`}
                />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section (Bottom) */}
        <div className="mt-auto pt-6 border-t border-muted-border">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User"}
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-muted-border"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-app-text truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-t border-muted-border px-6 flex items-center justify-around z-40">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? "animate-in fade-in zoom-in duration-300" : ""}`}
              />
              <span className="text-[10px] font-medium uppercase tracking-tighter">
                {link.label}
              </span>
            </Link>
          );
        })}
        {/* Simple Avatar for Mobile Profile shortcut */}
        {user && (
          <Link href="/profile">
            <Image
              src={user.image || "/default-avatar.png"}
              alt="Profile"
              width={28}
              height={28}
              className={`rounded-full border-2 ${pathname === "/profile" ? "border-blue-600" : "border-transparent"}`}
            />
          </Link>
        )}
      </nav>
    </>
  );
}
