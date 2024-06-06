"use client";
import { useSession, signIn, signOut } from "next-auth/react";
export default function MiniProfile() {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-between mt-14 ml-10 w-full gap-3">
      <img
        src={session?.user?.image || "/logo-img.png"}
        alt={session?.user?.name || "Clickgram User"}
        className="w-16 h-16 rounded-full border p-[2px]"
      />
      <div className="flex-1">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">
          {session?.user?.name || "Welcome to Clickgram"}
        </h3>
      </div>
      {session ? (
        <button
          onClick={signOut}
          className="text-red-600 text-sm font-semibold"
        >
          Log Out
        </button>
      ) : (
        <button
          onClick={signIn}
          className="text-blue-400 text-sm font-semibold"
        >
          Log In
        </button>
      )}
    </div>
  );
}
