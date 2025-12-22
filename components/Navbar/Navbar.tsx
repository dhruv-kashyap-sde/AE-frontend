"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  BookOpen,
  ChevronDown,
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
import { cn } from "@/lib/utils";
import React from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
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
                    <NavigationMenuTrigger className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
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
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <Link
              href="/about"
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <div className="px-4 pt-4 space-y-2 border-t">
              <Link href="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={toggleMenu}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
