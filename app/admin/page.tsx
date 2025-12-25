"use client";
import React, { useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  FileText,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const page = () => {
      // State for Exams
      const [categories, setCategories] = useState<Array<{ id: number; name: string; image: string }>>([
        { id: 1, name: "Engineering", image: "/cat1.jpg" },
        { id: 2, name: "Medical", image: "/cat2.jpg" },
      ]);
      const [exams, setExams] = useState<Array<{ id: number; title: string; categoryId: number; image: string; questions: Array<any> }>>([
        { id: 1, title: "JEE Main 2025", categoryId: 1, image: "/exam1.jpg", questions: [] },
        { id: 2, title: "NEET 2025", categoryId: 2, image: "/exam2.jpg", questions: [] },
      ]);
    
      // State for Users
      const [users] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", joined: "2024-01-15", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", joined: "2024-02-20", status: "Active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", joined: "2024-03-10", status: "Inactive" },
        { id: 4, name: "Alice Williams", email: "alice@example.com", joined: "2024-04-05", status: "Active" },
        { id: 5, name: "Charlie Brown", email: "charlie@example.com", joined: "2024-05-12", status: "Active" },
      ]);

  return(
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>
      <p className="text-muted-foreground">Welcome back, Admin!</p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{exams.length}</div>
          <p className="text-xs text-muted-foreground">+2 from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">256</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Exams</CardTitle>
          <CardDescription>Top performing exams this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exams.slice(0, 3).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.questions.length} questions
                    </p>
                  </div>
                </div>
                <Badge>Popular</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {user.joined}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)};

export default page;
