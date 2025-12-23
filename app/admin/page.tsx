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
import HomeComponent from "./Homecomponent";
import UsersComponent from "./UsersComponent";
import ExamsComponent from "./ExamsComponent";

const page = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  // Dialog states
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [examDialog, setExamDialog] = useState(false);
  const [questionDialog, setQuestionDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [newExam, setNewExam] = useState({ title: "", categoryId: "", image: "" });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: "1",
  });

  // Handlers
  const handleCreateCategory = () => {
    setCategories([...categories, { id: Date.now(), ...newCategory }]);
    setNewCategory({ name: "", image: "" });
    setCategoryDialog(false);
  };

  const handleCreateExam = () => {
    setExams([...exams, { id: Date.now(), ...newExam, categoryId: Number(newExam.categoryId), questions: [] }]);
    setNewExam({ title: "", categoryId: "", image: "" });
    setExamDialog(false);
  };

  const handleAddQuestion = () => {
    const updatedExams = exams.map((exam) =>
      exam.id === selectedExam
        ? {
            ...exam,
            questions: [
              ...exam.questions,
              {
                id: Date.now(),
                ...newQuestion,
              },
            ],
          }
        : exam
    );
    setExams(updatedExams);
    setNewQuestion({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "1",
    });
    setQuestionDialog(false);
  };

  // Filtered users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Components





  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="flex  h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r relative transition-all duration-300 flex  flex-col`}
      >
        <div className="p-4  border-b">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "home"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Home className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Home</span>}
          </button>

          <button
            onClick={() => setActiveTab("exams")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "exams"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <BookOpen className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Exams</span>}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            <Users className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Users</span>}
          </button>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full border border-destructive flex items-center gap-3 p-3 text-destructive rounded-lg hover:bg-destructive hover:text-primary-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-15 -right-3 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-6">
          {activeTab === "home" && <HomeComponent />}
          {activeTab === "exams" && <ExamsComponent />}
          {activeTab === "users" && <UsersComponent />}
        </div>
      </main>
    </div>
  );
};

export default page;