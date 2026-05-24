import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Journal Home</h1>

      {session ? (
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p>
            Logged in as:{" "}
            <span className="font-mono">{session.user?.email}</span>
          </p>
          <img
            src={session.user?.image || ""}
            alt="Profile"
            className="w-10 h-10 rounded-full mt-2"
          />
        </div>
      ) : (
        <p className="mt-4 text-red-500">Not logged in.</p>
      )}
    </main>
  );
}
