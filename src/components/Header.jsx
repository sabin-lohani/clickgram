"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <header className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="hidden lg:inline-flex">
          <Image
            src="/logo-text.png"
            width={96}
            height={96}
            alt="clickgram logo"
          />
        </Link>
        <Link href="/" className="lg:hidden">
          <Image
            src="/logo-img.png"
            width={40}
            height={40}
            alt="clickgram logo"
          />
        </Link>

        <input
          type="search"
          placeholder="Search"
          className="bg-gray-50 text-black border  border gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />

        {session?.user ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={signOut}
          />
        ) : (
          <button
            className="text-sm font-semibold text-blue-500"
            onClick={signIn}
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
}
