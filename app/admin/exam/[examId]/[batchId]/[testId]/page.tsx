"use client";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  PencilIcon,
  TrashIcon,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadExcel from "./UploadExcel";
import SmartText from "./SmartText";

type Question = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  image?: string;
};

export default function page() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the capital of France?",
      option_a: "London",
      option_b: "Berlin",
      option_c: "Paris",
      option_d: "Madrid",
      correct_option: "C",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      option_a: "Venus",
      option_b: "Mars",
      option_c: "Jupiter",
      option_d: "Saturn",
      correct_option: "B",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
  });

  const handleExcelUpload = (uploadedQuestions: Question[]) => {
    setQuestions([...questions, ...uploadedQuestions]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        image: undefined,
      });
    }
  };

  // coded for later use
  // const handleAddQuestion = () => {
  //   if (newQuestion.question.trim()) {
  //     setQuestions([
  //       ...questions,
  //       {
  //         id: Date.now(),
  //         ...newQuestion,
  //       },
  //     ]);
  //     setNewQuestion({
  //       question: "",
  //       option_a: "",
  //       option_b: "",
  //       option_c: "",
  //       option_d: "",
  //       correct_option: "A",
  //     });
  //     setIsAddDialogOpen(false);
  //   }
  // };

  const handleEditQuestion = () => {
    if (editingQuestion) {
      const updatedQuestion = {
        ...editingQuestion,
        image: imagePreview || editingQuestion.image,
      };
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? updatedQuestion : q
        )
      );
      setEditingQuestion(null);
      setIsEditDialogOpen(false);
      setSelectedImageFile(null);
      setImagePreview(null);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  return (
    <div className="space-y-6 overflow-y-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/exam">Exams</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/exam/exam-title`}>
              Exam Title
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/exam/exam-title/batch-title`}>Batch Title</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Test Title</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">Test Title</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Add questions to this test and manage its settings.
          </p>
        </div>

        <div className="flex gap-2">
          {/* Upload Excel Dialog */}
          <UploadExcel onUpload={handleExcelUpload} />

          {/* Edit Question Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Question</DialogTitle>
                <DialogDescription>Update question details</DialogDescription>
              </DialogHeader>

              {editingQuestion && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-question">Question</Label>
                    <Textarea
                      id="edit-question"
                      placeholder="Enter your question"
                      value={editingQuestion.question}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          question: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-option_a">Option A</Label>
                      <Input
                        id="edit-option_a"
                        value={editingQuestion.option_a}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            option_a: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-option_b">Option B</Label>
                      <Input
                        id="edit-option_b"
                        value={editingQuestion.option_b}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            option_b: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-option_c">Option C</Label>
                      <Input
                        id="edit-option_c"
                        value={editingQuestion.option_c}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            option_c: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-option_d">Option D</Label>
                      <Input
                        id="edit-option_d"
                        value={editingQuestion.option_d}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            option_d: e.target.value,
                          })
                        }
                      />
                    </div>
                  

                  <div>
                    <Label htmlFor="edit-correct_option">Correct Option</Label>
                    <Select
                      value={editingQuestion.correct_option}
                      onValueChange={(value: "A" | "B" | "C" | "D") =>
                        setEditingQuestion({
                          ...editingQuestion,
                          correct_option: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="optional_image">Attach Image (optional)</Label>
                    <Input
                      type="file"
                      id="optional_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {(imagePreview || editingQuestion?.image) && (
                      <div className="mt-3 relative inline-block">
                        <img
                          src={imagePreview || editingQuestion?.image}
                          alt="Question preview"
                          className="max-w-full h-auto max-h-48 rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingQuestion(null);
                    setSelectedImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditQuestion}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      <div className="text-muted-foreground text-xs grid grid-cols-2 md:grid-cols-4 md:w-fit gap-2 -mt-4">
        <p>
          Questions: <span className="font-bold">{questions.length}</span>
        </p>
        <p>
          Marks/Q: <span className="font-bold">4</span>
        </p>
        <p>
          Duration: <span className="font-bold">60 min</span>
        </p>
        <p>
          Negative: <span className="font-bold">-1</span>
        </p>
      </div>

      <div className="bg-card rounded-lg border">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Questions Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">S. No.</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-24">Option A</TableHead>
                <TableHead className="w-24">Option B</TableHead>
                <TableHead className="w-24">Option C</TableHead>
                <TableHead className="w-24">Option D</TableHead>
                <TableHead className="w-24">Correct Option</TableHead>
                <TableHead className="w-16 text-center">Image</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentQuestions.length > 0 ? (
                currentQuestions.map((question, idx) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      {indexOfFirstQuestion + idx + 1}
                    </TableCell>
                    <TableCell className=" text-muted-foreground max-w-md">
                      <SmartText text={question.question} />
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.option_a} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.option_b} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.option_c} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.option_d} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{question.correct_option}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {question.image ? (
                        <ImageIcon className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            setEditingQuestion(question);
                            setImagePreview(question.image || null);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Question
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this question?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No questions found matching "{searchQuery}"
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredQuestions.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {indexOfFirstQuestion + 1} to{" "}
              {Math.min(indexOfLastQuestion, filteredQuestions.length)} of{" "}
              {filteredQuestions.length} questions
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
              <div className="flex items-center gap-1">
                <span className="text-sm px-3 py-1 bg-muted rounded">
                  {currentPage}
                </span>
                <span className="text-sm text-muted-foreground">
                  of {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
