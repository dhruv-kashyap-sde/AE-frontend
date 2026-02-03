"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  Building2,
  Landmark,
  Train,
  Briefcase,
  FileText,
  School,
  Shield,
  HeartPulse,
  Cog,
  Trophy,
  GraduationCap,
  LogOut,
  LayoutDashboard,
  User,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logoImage from "@/public/logo.jpg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import AuthDialog from "@/components/AuthDialog";
import { ModeToggle } from "../dark mode/toggle-theme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const { data: session, status } = useSession();

  const user = session?.user;
  const isLoggedIn = status === "authenticated" && !!user;
  const isAdmin = user?.role === "admin";

  // Get the correct dashboard URL based on role
  const dashboardUrl = isAdmin ? "/admin" : "/dashboard";

  const openAuthDialog = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
    setIsOpen(false); // Close mobile menu if open
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const categories = [
    { id: "Bank", name: "Bank", icon: Building2 },
    { id: "SSC", name: "SSC", icon: Landmark },
    { id: "Railway", name: "Railway", icon: Train },
    { id: "State", name: "State", icon: Briefcase },
    { id: "Other", name: "Other", icon: FileText },
    { id: "Teaching", name: "Teaching", icon: School },
    { id: "Insurance", name: "Insurance", icon: Shield },
    { id: "Medical", name: "Medical", icon: HeartPulse },
    { id: "Engineering", name: "Engineering", icon: Cog },
    { id: "Defence", name: "Defence", icon: Trophy },
    { id: "GATE", name: "GATE", icon: GraduationCap },
  ];

  const exams = {
    Bank: [
      { name: "RRB NTPC", category: "Bank" },
      { name: "RRB Group-D", category: "Bank" },
      { name: "RRB JE", category: "Bank" },
      { name: "RRB ALP", category: "Bank" },
      { name: "RPF SI", category: "Bank" },
      { name: "RPF Constable", category: "Bank" },
      { name: "RRB Technician", category: "Bank" },
    ],
    SSC: [
      { name: "SSC CGL", category: "SSC" },
      { name: "SSC CHSL", category: "SSC" },
      { name: "SSC MTS", category: "SSC" },
      { name: "SSC CPO", category: "SSC" },
    ],
    Railway: [
      { name: "Railway RRB", category: "Railway" },
      { name: "Railway Group D", category: "Railway" },
      { name: "Railway ALP", category: "Railway" },
    ],
    State: [
      { name: "State PSC", category: "State" },
      { name: "State Police", category: "State" },
    ],
    Other: [
      { name: "UPSC", category: "Other" },
      { name: "Banking", category: "Other" },
    ],
    Teaching: [
      { name: "CTET", category: "Teaching" },
      { name: "UPTET", category: "Teaching" },
    ],
    Insurance: [
      { name: "LIC AAO", category: "Insurance" },
      { name: "NIACL", category: "Insurance" },
    ],
    Medical: [
      { name: "NEET", category: "Medical" },
      { name: "AIIMS", category: "Medical" },
    ],
    Engineering: [
      { name: "JEE Main", category: "Engineering" },
      { name: "JEE Advanced", category: "Engineering" },
    ],
    Defence: [
      { name: "NDA", category: "Defence" },
      { name: "CDS", category: "Defence" },
    ],
    GATE: [
      { name: "GATE CSE", category: "GATE" },
      { name: "GATE ECE", category: "GATE" },
    ],
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b shadow-md bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-10 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                {/* <BookOpen className="h-6 w-6 text-primary-foreground" /> */}
                <Image
                  src={logoImage}
                  alt="Hero Image"
                  className="rounded-full  object-cover"
                  // width={600}
                  // height={400}
                />
              </div>
              <span className="text-xl font-bold">AccurateExam</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
                    >
                      <Link href="/about">About</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent px-4 py-2">
                      Exams
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-200 h-120 scrollbar p-4 overflow-auto">
                        <div className="grid grid-cols-3 gap-4">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="group rounded-lg p-3 hover:bg-accent transition-colors"
                            >
                              <Link
                                href={`/exams/${cat.id.toLowerCase()}`}
                                className="block"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <cat.icon className="h-5 w-5 text-primary" />
                                  </div>
                                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                                    {cat.name}
                                  </h3>
                                </div>
                              </Link>
                              <div className="space-y-1 ml-2">
                                {exams[cat.id as keyof typeof exams]
                                  ?.slice(0, 4)
                                  .map((exam) => (
                                    <Link
                                      key={exam.name}
                                      href={`/exam/${exam.name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                      className="block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all py-1"
                                    >
                                      {exam.name}
                                    </Link>
                                  ))}
                                {(exams[cat.id as keyof typeof exams]?.length ||
                                  0) > 4 && (
                                  <Link
                                    href={`/exams/${cat.id.toLowerCase()}`}
                                    className="block text-sm text-primary hover:underline py-1"
                                  >
                                    View all →
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
                    >
                      <Link href="/contact">Contact</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <Avatar className="h-10 w-10 cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                        <AvatarImage
                          src={user?.image || ""}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user?.name || "User")}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user?.image || ""}
                            alt={user?.name || "User"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user?.name || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground leading-none">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardUrl}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/exam"
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setIsOpen(false)}
                        >
                          <ClipboardList className="h-4 w-4" />
                          Manage exams
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/tests"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ClipboardList className="h-4 w-4" />
                          My Tests
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
              </>
            ) : (
              <>
                <Button onClick={() => openAuthDialog("login")}>
                  Login / Signup
                </Button>
                <ModeToggle />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-md hover:bg-accent"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[80%]  sm:w-100">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <Image
                        src={logoImage}
                        alt="Logo"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="text-lg font-bold">AccurateExam</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className=" px-4 overflow-auto scrollbar flex flex-col gap-6">
                {/* About Link */}
                <Link
                  href="/about"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                {/* Exams Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="exams" className="border-none">
                    <AccordionTrigger className="text-base font-medium text-muted-foreground hover:text-foreground py-0 hover:no-underline">
                      Exams
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {categories.map((cat) => (
                          <div key={cat.id} className="space-y-2">
                            <Link
                              href={`/exams/${cat.id.toLowerCase()}`}
                              className="flex items-center gap-2 font-semibold text-sm hover:text-primary transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <cat.icon className="h-4 w-4 text-primary" />
                              {cat.name}
                            </Link>
                            <div className="ml-6 space-y-1">
                              {exams[cat.id as keyof typeof exams]
                                ?.slice(0, 3)
                                .map((exam) => (
                                  <Link
                                    key={exam.name}
                                    href={`/exam/${exam.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {exam.name}
                                  </Link>
                                ))}
                              {(exams[cat.id as keyof typeof exams]?.length ||
                                0) > 3 && (
                                <Link
                                  href={`/exams/${cat.id.toLowerCase()}`}
                                  className="block text-sm text-primary hover:underline py-1"
                                  onClick={() => setIsOpen(false)}
                                >
                                  View all →
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Contact Link */}
                <Link
                  href="/contact"
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>

                {/* CTA Buttons / User Profile */}
                <div className="pt-6 space-y-3 border-t">
                  {isLoggedIn ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center gap-3 py-3 px-2 rounded-lg bg-accent/50">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user?.image || ""}
                            alt={user?.name || "User"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user?.name || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <span className="text-xs text-destructive font-medium">
                              Administrator
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <Link
                        href={dashboardUrl}
                        className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/exam"
                          className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <ClipboardList className="h-4 w-4" />
                          Manage exams
                        </Link>
                      )}
                      {!isAdmin && (
                        <Link
                          href="/dashboard/tests"
                          className="flex items-center gap-3 py-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <ClipboardList className="h-4 w-4" />
                          My Tests
                        </Link>
                      )}

                      {/* Logout Button */}
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openAuthDialog("login")}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => openAuthDialog("signup")}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode={authMode}
      />
    </nav>
  );
}
