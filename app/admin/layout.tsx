"use client";
import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  LogOut,
  LayoutDashboard,
  Menu,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: session, status } = useSession();

  // Redirect to admin login if not authenticated
  if (status === "unauthenticated") {
    redirect("/login?admin=true");
  }

  // Redirect to home if authenticated but not admin
  if (status === "authenticated" && session?.user?.role !== "admin") {
    redirect("/");
  }

  const admin = session?.user;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login?admin=true" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/exam", label: "Exams", icon: BookOpen },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header with Hamburger */}
      <header className="sticky top-0 z-40 w-full border-b bg-destructive/5 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            {/* Hamburger Menu */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="p-4 border-b bg-destructive/10">
                  <SheetTitle>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2"
                      onClick={() => setSheetOpen(false)}
                    >
                      <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-xl">Admin Panel</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Admin Info */}
                {admin && (
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-destructive text-primary-foreground">
                          {getInitials(admin?.name || "Admin")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-medium truncate">{admin?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
                        <span className="text-xs text-destructive font-medium mt-0.5">Administrator</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                    >
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isActive(link.href)
                            ? "bg-destructive text-primary-foreground"
                            : "hover:bg-accent text-foreground"
                        }`}
                      >
                        <link.icon className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </button>
                    </Link>
                  ))}
                </nav>

                <Separator />

                {/* Logout Button */}
                <div className="p-4">
                  <button
                    onClick={() => {
                      setSheetOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-destructive rounded-lg border border-destructive/50 hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Page Title */}
            <div className="flex items-center gap-2">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg hidden sm:inline">Admin Panel</span>
              </Link>
            </div>

            {/* Right side - Admin Badge */}
            <div className="ml-auto flex items-center gap-2">
              {admin && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-destructive hidden sm:inline">
                    {admin?.name}
                  </span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-destructive text-primary-foreground text-sm">
                      {getInitials(admin?.name || "Admin")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}