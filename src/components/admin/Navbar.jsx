'use client';

import React, { useTransition } from "react";
import { Menu, LogOut, User, Bell } from "lucide-react";
import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

/**
 * Top Navbar of the Admin Panel.
 * Includes user profile, mobile responsive sidebar trigger, and notifications indicator.
 * @param {object} props
 * @param {object} props.user - Active admin user session details.
 */
export default function Navbar({ user }) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm shrink-0">
      {/* 1. Mobile Sidebar Menu Toggle Button */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:bg-neutral-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-neutral-900 border-neutral-800 text-white">
            <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
            <Sidebar className="w-full" />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block text-sm text-neutral-500 font-medium">
        Welcome back, <span className="text-neutral-800 font-semibold">{user?.name || "Administrator"}</span>
      </div>

      {/* 2. Right Actions: Notification Bell + Log Out + Profile Dropdown */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification indicator */}
        <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:bg-neutral-50 rounded-full cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-red-600"></span>
        </Button>

        {/* Direct Log Out Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 h-9 text-neutral-600 border-neutral-200 hover:bg-neutral-50 cursor-pointer font-semibold"
        >
          <LogOut className="h-4 w-4" />
          <span>{isPending ? "Logging out..." : "Log Out"}</span>
        </Button>

        {/* User profile dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-neutral-50 border border-neutral-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white font-bold text-sm">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline text-sm font-semibold text-neutral-700">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 border-neutral-100 shadow-md">
            <DropdownMenuLabel className="font-normal p-3 flex flex-col space-y-1">
              <p className="text-sm font-semibold text-neutral-800">{user?.name || "Administrator"}</p>
              <p className="text-xs text-neutral-400 truncate">{user?.email || "admin@yourdomain.com"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-100" />
            <DropdownMenuItem
              className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 p-2.5 cursor-pointer flex items-center gap-2"
              disabled={isPending}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>{isPending ? "Logging out..." : "Log Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
