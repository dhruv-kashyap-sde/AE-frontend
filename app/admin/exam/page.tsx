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
  FolderPlus,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySheet } from "./CategorySheet";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const page = () => {
  // State for Exams
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; image: string }>
  >([
    { id: "1", name: "Engineering", image: "/cat1.jpg" },
    { id: "2", name: "Medical", image: "/cat2.jpg" },
  ]);
  const [exams, setExams] = useState<
    Array<{
      id: number;
      title: string;
      slug: string;
      categoryId: number;
      image: string;
      questions: Array<any>;
    }>
  >([
    {
      id: 1,
      title: "JEE Main 2025",
      slug: "jee-main-2025",
      categoryId: 1,
      image: "/exam1.jpg",
      questions: [],
    },
    {
      id: 2,
      title: "NEET 2025",
      slug: "neet-2025",
      categoryId: 2,
      image: "/exam2.jpg",
      questions: [],
    },
  ]);

  // Dialog states
  const [examDialog, setExamDialog] = useState(false);
  const [newExam, setNewExam] = useState({
    title: "",
    categoryId: "",
    image: "",
    slug: "",
  });

  const handleCreateExam = () => {
    setExams([
      ...exams,
      {
        id: Date.now(),
        ...newExam,
        categoryId: Number(newExam.categoryId),
        questions: [],
        slug: newExam.title.toLowerCase().replace(/\s+/g, "-"),
      },
    ]);
    setNewExam({ title: "", categoryId: "", image: "", slug: "" });
    setExamDialog(false);
  };


  return (
    <div className="space-y-6 overflow-y-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Exams</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">Exam Management</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Create and manage exam categories and tests
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Create Exam */}
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
                  <Label className="mb-2" htmlFor="exam-title">
                    Exam Title
                  </Label>
                  <Input
                    id="exam-title"
                    placeholder="e.g., JEE Main 2025"
                    value={newExam.title}
                    onChange={(e) =>
                      setNewExam({ ...newExam, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2" htmlFor="exam-category">
                      Category
                    </Label>
                    <Select
                      value={newExam.categoryId}
                      onValueChange={(value) =>
                        setNewExam({ ...newExam, categoryId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>{" "}
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Category</SelectLabel>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>{" "}
                      </SelectContent>
                    </Select>
                    <Select></Select>
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="exam-image">
                      Image URL
                    </Label>
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
              </div>
              <DialogFooter>
                <Button onClick={handleCreateExam}>Create Exam</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <CategorySheet />
        </div>
      </div>

      <Separator />
      <div className="bg-card border rounded-lg">
        <Table className="text-center">
          <TableHeader className="bg-transparent">
            <TableRow>
              <TableHead className="w-25 text-center">Logo</TableHead>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Total Tests</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <TableRow
                  onClick={() => navigator}
                  key={exam.id}
                >
                  <TableCell className="font-medium">
                    <Avatar className="h-10 w-10 mx-auto">
                      <img
                        src="https://www.mockers.in/storage/exams/August2023/tNSML6LJjntagAE2hO3W.png"
                        alt="Exam Image"
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.categoryId}
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell className="text-muted-foreground">
                    24-12-25
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Link href={`exam/${exam.slug}`}>
                      <Button
                        size={"icon-sm"}
                        variant={"ghost"}
                      >
                        <Eye />
                      </Button>
                    </Link>
                    <Button
                      size={"icon-sm"}
                      variant={"ghost"}
                      className="text-primary hover:text-primary"
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size={"icon-sm"}
                      variant={"ghost"}
                      className="text-destructive hover:text-destructive"
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderPlus />
                  </EmptyMedia>
                  <EmptyTitle>No Exams</EmptyTitle>
                  <EmptyDescription>Create First Exam</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => setExamDialog(true)}
                    variant={"secondary"}
                  >
                    Create
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
