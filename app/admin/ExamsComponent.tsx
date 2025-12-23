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

const ExamsComponent = () => {
  // State for Exams
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; image: string }>
  >([
    { id: 1, name: "Engineering", image: "/cat1.jpg" },
    { id: 2, name: "Medical", image: "/cat2.jpg" },
  ]);
  const [exams, setExams] = useState<
    Array<{
      id: number;
      title: string;
      categoryId: number;
      image: string;
      questions: Array<any>;
    }>
  >([
    {
      id: 1,
      title: "JEE Main 2025",
      categoryId: 1,
      image: "/exam1.jpg",
      questions: [],
    },
    {
      id: 2,
      title: "NEET 2025",
      categoryId: 2,
      image: "/exam2.jpg",
      questions: [],
    },
  ]);

  // State for Users
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joined: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joined: "2024-02-20",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      joined: "2024-03-10",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      joined: "2024-04-05",
      status: "Active",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      joined: "2024-05-12",
      status: "Active",
    },
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
  const [newExam, setNewExam] = useState({
    title: "",
    categoryId: "",
    image: "",
  });
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
    setExams([
      ...exams,
      {
        id: Date.now(),
        ...newExam,
        categoryId: Number(newExam.categoryId),
        questions: [],
      },
    ]);
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


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Exam Management</h2>
          <p className="text-muted-foreground">
            Create and manage exam categories and tests
          </p>
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
                <DialogDescription>
                  Add a new exam category to organize your tests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g., Engineering"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cat-image">Image URL</Label>
                  <Input
                    id="cat-image"
                    placeholder="Enter image URL"
                    value={newCategory.image}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, image: e.target.value })
                    }
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
                <DialogDescription>
                  Add a new exam to a category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exam-title">Exam Title</Label>
                  <Input
                    id="exam-title"
                    placeholder="e.g., JEE Main 2025"
                    value={newExam.title}
                    onChange={(e) =>
                      setNewExam({ ...newExam, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="exam-category">Category</Label>
                  <select
                    id="exam-category"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newExam.categoryId}
                    onChange={(e) =>
                      setNewExam({ ...newExam, categoryId: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewExam({ ...newExam, image: e.target.value })
                    }
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
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
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
                      <Dialog
                        open={questionDialog && selectedExam === exam.id}
                        onOpenChange={(open) => {
                          setQuestionDialog(open);
                          if (!open) setSelectedExam(null);
                        }}
                      >
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
                            <DialogDescription>
                              Add a new multiple choice question to {exam.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="question">Question</Label>
                              <Input
                                id="question"
                                placeholder="Enter your question"
                                value={newQuestion.question}
                                onChange={(e) =>
                                  setNewQuestion({
                                    ...newQuestion,
                                    question: e.target.value,
                                  })
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
                                    setNewQuestion({
                                      ...newQuestion,
                                      option1: e.target.value,
                                    })
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
                                    setNewQuestion({
                                      ...newQuestion,
                                      option2: e.target.value,
                                    })
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
                                    setNewQuestion({
                                      ...newQuestion,
                                      option3: e.target.value,
                                    })
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
                                    setNewQuestion({
                                      ...newQuestion,
                                      option4: e.target.value,
                                    })
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
                                  setNewQuestion({
                                    ...newQuestion,
                                    correctOption: e.target.value,
                                  })
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
                            <Button onClick={handleAddQuestion}>
                              Add Question
                            </Button>
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
};

export default ExamsComponent;
