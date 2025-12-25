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
} from "lucide-react";
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
export default function page({ params }: { params: Promise<{ examId: string, batchId: string }> }) {

  const { examId, batchId } = React.use(params);

  const [test, setTest] = useState<
    Array<{
      id: number;
      title: string;
      testCount: number;
      dateCreated: string;
    }>
  >([
    {
      id: 1,
      title: "Test 2025 - Morning",
      testCount: 15,
      dateCreated: "2024-01-15",
    },
    {
      id: 2,
      title: "Test 2025 - Evening",
      testCount: 12,
      dateCreated: "2024-02-20",
    },
    {
      id: 3,
      title: "Test 2024 - Practice",
      testCount: 8,
      dateCreated: "2024-03-10",
    },
  ]);

  const [testDialog, setTestDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [newTest, setNewTest] = useState({
    title: "",
  });

  const handleCreateTest = () => {
    if (newTest.title.trim()) {
      setTest([
        ...test,
        {
          id: Date.now(),
          title: newTest.title,
          testCount: 0,
          dateCreated: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewTest({ title: "" });
      setTestDialog(false);
    }
  };

  const handleEditTest = () => {
    if (editingTest && editingTest.title.trim()) {
      setTest(
        test.map((test) =>
          test.id === editingTest.id
            ? { ...test, title: editingTest.title }
            : test
        )
      );
      setEditingTest(null);
    }
  };

  const handleDeleteTest = (id: number) => {
    setTest(test.filter((test) => test.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
            <BreadcrumbPage>
              Batch Title
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">Batch Title</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Create and manage Tests</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Create Test */}
          <Dialog open={testDialog} onOpenChange={setTestDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Create Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
                <DialogDescription>
                  Add questions and manage settings
                </DialogDescription>
              </DialogHeader>
             
              <DialogFooter>
                <Button onClick={handleCreateTest}>Create Test</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog
            open={!!editingTest}
            onOpenChange={(open) => !open && setEditingTest(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Test</DialogTitle>
                <DialogDescription>Update test information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2" htmlFor="edit-test-title">
                    Test Title
                  </Label>
                  <Input
                    id="edit-test-title"
                    placeholder="e.g., Test 2025 - Morning"
                    value={editingTest?.title || ""}
                    onChange={(e) =>
                      setEditingTest(
                        editingTest
                          ? { ...editingTest, title: e.target.value }
                          : null
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditTest();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingTest(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTest}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      
      </section>
    </div>
  );
}
