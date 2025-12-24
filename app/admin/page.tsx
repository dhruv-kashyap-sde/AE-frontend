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
import HomeComponent from "./Homecomponent";
import UsersComponent from "./UsersComponent";
import ExamsComponent from "./exam/ExamComponent";

const page = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="flex  h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-56" : "w-20"
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