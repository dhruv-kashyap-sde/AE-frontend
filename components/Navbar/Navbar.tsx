"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { User as UserType } from "@/types/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user: authUser, isAuthenticated, logout, loading } = useAuth();
  const user = authUser as UserType | null;
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setIsOpen(false);
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
            {loading ? (
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || ""} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
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
                  {loading ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
                        <div className="h-3 w-32 bg-muted-foreground/20 rounded" />
                      </div>
                    </div>
                  ) : isAuthenticated && user ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || ""} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>

                      {/* Dashboard Button */}
                      <Button asChild variant="outline" className="w-full">
                        <Link
                          href={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setIsOpen(false)}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>

                      {/* Logout Button */}
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
