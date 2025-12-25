"use client";
import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-20"
        } bg-card border-r relative transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <button
              className={`w-full flex items-center mb-3 gap-3 p-3 rounded-lg transition-colors ${
                isActive("/admin")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <Home className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className=" text-sm">Home</span>}
            </button>
          </Link>

          <Link href="/admin/exam">
            <button
              className={`w-full flex items-center mb-3 gap-3 p-3 rounded-lg transition-colors ${
                isActive("/admin/exam")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <BookOpen className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className=" text-sm">Exams</span>}
            </button>
          </Link>

          <Link href="/admin/users">
            <button
              className={`w-full flex items-center mb-3 gap-3 p-3 rounded-lg transition-colors ${
                isActive("/admin/users")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <Users className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className=" text-sm">Users</span>}
            </button>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full border border-destructive/50 flex items-center gap-3 p-3 text-destructive rounded-lg hover:bg-destructive/50 hover:text-primary-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-15 -right-3 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-6">{children}</div>
      </main>
    </div>
  );
};

export default layout;