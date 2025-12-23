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
  const [activeTab, setActiveTab] = useState("home");
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
  const HomeComponent = () => (
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
                      <p className="text-sm text-muted-foreground">{exam.questions.length} questions</p>
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
                    <p className="text-xs text-muted-foreground">Joined {user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ExamsComponent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Exam Management</h2>
          <p className="text-muted-foreground">Create and manage exam categories and tests</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>Add a new exam category to organize your tests</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g., Engineering"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cat-image">Image URL</Label>
                  <Input
                    id="cat-image"
                    placeholder="Enter image URL"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={examDialog} onOpenChange={setExamDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>Add a new exam to a category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exam-title">Exam Title</Label>
                  <Input
                    id="exam-title"
                    placeholder="e.g., JEE Main 2025"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="exam-category">Category</Label>
                  <select
                    id="exam-category"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newExam.categoryId}
                    onChange={(e) => setNewExam({ ...newExam, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="exam-image">Image URL</Label>
                  <Input
                    id="exam-image"
                    placeholder="Enter image URL"
                    value={newExam.image}
                    onChange={(e) => setNewExam({ ...newExam, image: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateExam}>Create Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>Exams in this category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exams
                  .filter((exam) => exam.categoryId === category.id)
                  .map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{exam.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.questions.length} questions added
                          </p>
                        </div>
                      </div>
                      <Dialog open={questionDialog && selectedExam === exam.id} onOpenChange={(open) => {
                        setQuestionDialog(open);
                        if (!open) setSelectedExam(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedExam(exam.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Question
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add MCQ Question</DialogTitle>
                            <DialogDescription>Add a new multiple choice question to {exam.title}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="question">Question</Label>
                              <Input
                                id="question"
                                placeholder="Enter your question"
                                value={newQuestion.question}
                                onChange={(e) =>
                                  setNewQuestion({ ...newQuestion, question: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="opt1">Option 1</Label>
                                <Input
                                  id="opt1"
                                  placeholder="Option 1"
                                  value={newQuestion.option1}
                                  onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, option1: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="opt2">Option 2</Label>
                                <Input
                                  id="opt2"
                                  placeholder="Option 2"
                                  value={newQuestion.option2}
                                  onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, option2: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="opt3">Option 3</Label>
                                <Input
                                  id="opt3"
                                  placeholder="Option 3"
                                  value={newQuestion.option3}
                                  onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, option3: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="opt4">Option 4</Label>
                                <Input
                                  id="opt4"
                                  placeholder="Option 4"
                                  value={newQuestion.option4}
                                  onChange={(e) =>
                                    setNewQuestion({ ...newQuestion, option4: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="correct">Correct Option</Label>
                              <select
                                id="correct"
                                className="w-full px-3 py-2 border rounded-md"
                                value={newQuestion.correctOption}
                                onChange={(e) =>
                                  setNewQuestion({ ...newQuestion, correctOption: e.target.value })
                                }
                              >
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                                <option value="4">Option 4</option>
                              </select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddQuestion}>Add Question</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const UsersComponent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-muted-foreground">View and manage all registered users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
        <div className="container mx-auto p-8">
          {activeTab === "home" && <HomeComponent />}
          {activeTab === "exams" && <ExamsComponent />}
          {activeTab === "users" && <UsersComponent />}
        </div>
      </main>
    </div>
  );
};

export default page;