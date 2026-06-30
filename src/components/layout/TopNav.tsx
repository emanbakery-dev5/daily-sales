"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth/logout.action";

export function TopNav() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate breadcrumb from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentPageName =
    pathSegments.length > 0
      ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
      : "Dashboard";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 font-medium text-sm">Home</span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-100 font-semibold text-sm">
          {currentPageName}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search Shortcut */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Global Search"
        >
          <Search size={16} />
          <span className="text-sm font-medium hidden sm:inline-block">
            Search...
          </span>
          <kbd className="hidden sm:inline-block text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 ml-2">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0A0F1E]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-white/20">
              A
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#141A28] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <p className="text-sm font-medium text-white truncate">
                  Ahmed User
                </p>
                <p className="text-xs text-gray-400 truncate">
                  System Administrator
                </p>
              </div>

              <div className="p-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <User size={16} />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <SettingsIcon size={16} />
                  Settings
                </Link>
              </div>

              <div className="p-1 border-t border-white/10">
                <form
                  action={async () => {
                    await signOutAction();
                  }}
                >
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
