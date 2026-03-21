"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
      <Link href="/" className="font-bold text-violet-400 text-lg">
        🌳 SkillTree
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">
          Explore
        </Link>
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-2 focus:outline-none">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-sm font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="text-sm font-medium text-white truncate">{session.user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    My Skill Tree
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
