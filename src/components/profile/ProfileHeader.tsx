import Image from "next/image";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt?: string | Date;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // Format the membership date mileston
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Recent Member";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Google OAuth Avatar Frame */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User Avatar"}
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          ) : (
            // Fallback avatar graphic using standard initials layout
            <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-2xl font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        {/* Identity Information Column */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-baseline">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {user.name || "Journal User"}
            </h2>
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/20">
              Google Account Connected
            </span>
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {user.email}
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Member since {memberSince}
          </p>
        </div>
      </div>
    </div>
  );
}
