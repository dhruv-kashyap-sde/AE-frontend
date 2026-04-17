"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  ShoppingBag,
  ArrowRight,
  CalendarDays,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface PurchaseItem {
  id: string;
  validFrom: string;
  validTill: string;
  status: "active" | "expired" | "revoked";
  batch: {
    id: string;
    title: string;
    slug: string;
    contentType: string;
    totalCount: number;
    exam: {
      id: string;
      title: string;
      slug: string;
      imageURL: string | null;
    } | null;
  } | null;
  totalTests: number;
  testsCompleted: number;
}

interface DashboardClientProps {
  userName: string;
  purchases: PurchaseItem[];
}

export default function DashboardClient({
  userName,
  purchases,
}: DashboardClientProps) {
  const activePurchases = purchases.filter(
    (p) => p.status === "active" && new Date(p.validTill) > new Date(),
  );
  const expiredPurchases = purchases.filter(
    (p) => p.status !== "active" || new Date(p.validTill) <= new Date(),
  );

  const totalTests = activePurchases.reduce((sum, p) => sum + p.totalTests, 0);
  const totalCompleted = activePurchases.reduce(
    (sum, p) => sum + p.testsCompleted,
    0,
  );

  const stats = [
    {
      title: "Practice Sets Bought",
      value: purchases.length.toString(),
      icon: ShoppingBag,
      description: "Total Practice Sets purchased",
    },
    {
      title: "Active Practice Sets",
      value: activePurchases.length.toString(),
      icon: BookOpen,
      description: "Currently accessible",
    },
    {
      title: "Tests Completed",
      value: `${totalCompleted}/${totalTests}`,
      icon: Target,
      description: "Overall progress",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">
          Ready to continue your exam preparation?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Purchases */}
      {activePurchases.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 ">
            <h2 className="text-lg font-semibold">My Practice Sets</h2>
            <div className="opacity-0"></div>
            <Input placeholder="Search practice sets..." className="max-w-md" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePurchases.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Practice Sets Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You haven&apos;t purchased any practice sets yet. Browse our
              collection of exam preparation materials to get started.
            </p>
            <Link href="/#browse_exams">
              <Button size="lg">
                Explore Exams
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Expired Purchases */}
      {expiredPurchases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Expired
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expiredPurchases.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} isExpired />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PurchaseCard({
  purchase,
  isExpired = false,
}: {
  purchase: PurchaseItem;
  isExpired?: boolean;
}) {
  if (!purchase.batch) return null;

  const purchaseDate = new Date(purchase.validFrom);
  const expiryDate = new Date(purchase.validTill);
  const now = new Date();

  // Days remaining
  const daysRemaining = Math.max(
    0,
    Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Card
      className={`transition-shadow hover:shadow-md ${isExpired ? "opacity-60" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold leading-tight truncate">
              {purchase.batch.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {purchase.batch.exam?.title}
            </p>
          </div>
          <Badge
            variant={isExpired ? "secondary" : "default"}
            className="shrink-0"
          >
            {isExpired ? "Expired" : `${daysRemaining}d left`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Purchased</span>
          </div>
          <span className="text-right font-medium">
            {formatDate(purchaseDate)}
          </span>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Expires</span>
          </div>
          <span className="text-right font-medium">
            {formatDate(expiryDate)}
          </span>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            <span>Tests</span>
          </div>
          <span className="text-right font-medium">
            {purchase.testsCompleted}/{purchase.totalTests} completed
          </span>
        </div>

        {/* Action */}
        {!isExpired && (
          <Link href={`/dashboard/practice-sets/${purchase.batch.id}`}>
            <Button className="w-full" size="sm">
              View Tests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
