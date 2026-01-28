"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Trophy, Clock, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/login")
  }

  // Redirect admin users to admin dashboard
  if (status === "authenticated" && session?.user?.role === "admin") {
    redirect("/admin")
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const user = session?.user

  const stats = [
    {
      title: "Exams Attempted",
      value: "0",
      icon: BookOpen,
      description: "Total exams taken"
    },
    {
      title: "Average Score",
      value: "0%",
      icon: Target,
      description: "Overall performance"
    },
    {
      title: "Time Spent",
      value: "0h",
      icon: Clock,
      description: "Total study time"
    },
    {
      title: "Achievements",
      value: "0",
      icon: Trophy,
      description: "Badges earned"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your exam preparation?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Start a Test
            </CardTitle>
            <CardDescription>
              Take a practice test from your purchased exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                Browse Available Tests
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              View Results
            </CardTitle>
            <CardDescription>
              Check your performance and detailed analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              My Purchases
            </CardTitle>
            <CardDescription>
              View and access your purchased exam packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Message */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Exams Yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven&apos;t purchased any exam packages yet. Browse our collection 
            of exam preparation materials to get started.
          </p>
          <Link href="/">
            <Button size="lg">
              Explore Exams
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}