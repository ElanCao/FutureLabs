"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/v1/notifications")
      .then((r) => r.ok ? r.json() : [])
      .then(setNotifications)
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function markAllRead() {
    await fetch("/api/v1/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); if (!open && unread > 0) markAllRead(); }}
        className="relative text-gray-400 hover:text-white transition-colors p-1"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-violet-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Notifications</span>
            {notifications.some((n) => !n.read) && (
              <button onClick={markAllRead} className="text-xs text-gray-500 hover:text-white transition-colors">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-600">No notifications yet.</div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-gray-800/60 last:border-0 text-sm ${n.read ? "text-gray-500" : "text-gray-200 bg-violet-950/20"}`}
                >
                  <p className="leading-snug">{n.message}</p>
                  <p className="text-xs text-gray-700 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const { data: session, status } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    if (userMenuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [userMenuOpen]);

  return (
    <nav className="border-b border-gray-800">
      <div className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
      <Link href="/" className="font-bold text-violet-400 text-lg">
        🌳 SkillTree
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">
          Explore
        </Link>
        <Link href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition-colors">
          Leaderboard
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
            <NotificationBell />
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="User menu"
              >
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
              {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50">
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
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
              )}
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
    </div>
    </nav>
  );
}
