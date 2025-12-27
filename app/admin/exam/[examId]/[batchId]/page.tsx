"use client";
import React, { useState } from "react";
import {
  FileText,
  Plus,
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
export default function page({
  params,
}: {
  params: Promise<{ examId: string; batchId: string }>;
}) {
  const { examId, batchId } = React.use(params);

  const [tests, setTests] = useState<
    Array<{
      id: number;
      title: string;
      slug: string;
      marksPerQuestion: number;
      negativeMarking: boolean;
      negativeMarkingValue: number;
      duration: number;
      questionCount: number;
      dateCreated: string;
    }>
  >([
    {
      id: 1,
      title: "Practice Test 1",
      slug: "practice-test-1",
      marksPerQuestion: 4,
      negativeMarking: true,
      negativeMarkingValue: 1,
      duration: 60,
      questionCount: 25,
      dateCreated: "2024-12-20",
    },
  ]);

  const [testDialog, setTestDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<{
    id: number;
    title: string;
    marksPerQuestion: number;
    negativeMarking: boolean;
    negativeMarkingValue: number;
    duration: number;
  } | null>(null);

  const [newTest, setNewTest] = useState({
    title: "",
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarkingValue: 0,
    duration: 60,
  });

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateTest = () => {
    if (newTest.title.trim()) {
      setTests([
        ...tests,
        {
          id: Date.now(),
          title: newTest.title,
          slug: createSlug(newTest.title),
          marksPerQuestion: newTest.marksPerQuestion,
          negativeMarking: newTest.negativeMarking,
          negativeMarkingValue: newTest.negativeMarking
            ? newTest.negativeMarkingValue
            : 0,
          duration: newTest.duration,
          questionCount: 0,
          dateCreated: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewTest({
        title: "",
        marksPerQuestion: 1,
        negativeMarking: false,
        negativeMarkingValue: 0,
        duration: 60,
      });
      setTestDialog(false);
    }
  };

  const handleEditTest = () => {
    if (editingTest && editingTest.title.trim()) {
      setTests(
        tests.map((test) =>
          test.id === editingTest.id
            ? {
                ...test,
                title: editingTest.title,
                slug: createSlug(editingTest.title),
                marksPerQuestion: editingTest.marksPerQuestion,
                negativeMarking: editingTest.negativeMarking,
                negativeMarkingValue: editingTest.negativeMarking
                  ? editingTest.negativeMarkingValue
                  : 0,
                duration: editingTest.duration,
              }
            : test
        )
      );
      setEditingTest(null);
    }
  };

  const handleDeleteTest = (id: number) => {
    setTests(tests.filter((test) => test.id !== id));
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
            <BreadcrumbPage>Batch Title</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">Batch Title</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Create and manage Tests
          </p>
        </div>

        {/* Actions */}
          {/* Create Test */}
          <Dialog open={testDialog} onOpenChange={setTestDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Create Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
                <DialogDescription>
                  Configure test settings and parameters
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="mb-1" htmlFor="test-title">
                    Test Title
                  </Label>
                  <Input
                    id="test-title"
                    placeholder="e.g., Mock Test 1"
                    value={newTest.title}
                    onChange={(e) =>
                      setNewTest({ ...newTest, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1" htmlFor="marks-per-question">
                      Marks per Question
                    </Label>
                    <Input
                      id="marks-per-question"
                      type="number"
                      min="1"
                      value={newTest.marksPerQuestion}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          marksPerQuestion: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-1" htmlFor="duration">
                      Duration (Minutes)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={newTest.duration}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          duration: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="negative-marking"
                      checked={newTest.negativeMarking}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          negativeMarking: e.target.checked,
                          negativeMarkingValue: e.target.checked
                            ? newTest.negativeMarkingValue
                            : 0,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label
                      htmlFor="negative-marking"
                      className="cursor-pointer mb-1"
                    >
                      Allow Negative Marking
                    </Label>
                  </div>

                  {newTest.negativeMarking && (
                    <div>
                      <Label className="mb-1" htmlFor="negative-value">
                        Negative Marks per Wrong Answer
                      </Label>
                      <Input
                        id="negative-value"
                        type="number"
                        min="0"
                        step="0.25"
                        value={newTest.negativeMarkingValue}
                        onChange={(e) =>
                          setNewTest({
                            ...newTest,
                            negativeMarkingValue: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest}>Create Test</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog
            open={!!editingTest}
            onOpenChange={(open) => !open && setEditingTest(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Test</DialogTitle>
                <DialogDescription>Update test settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="mb-1" htmlFor="edit-test-title">
                    Test Title
                  </Label>
                  <Input
                    id="edit-test-title"
                    placeholder="e.g., Mock Test 1"
                    value={editingTest?.title || ""}
                    onChange={(e) =>
                      setEditingTest(
                        editingTest
                          ? { ...editingTest, title: e.target.value }
                          : null
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-marks-per-question">
                      Marks per Question
                    </Label>
                    <Input
                      id="edit-marks-per-question"
                      type="number"
                      min="1"
                      value={editingTest?.marksPerQuestion || 1}
                      onChange={(e) =>
                        setEditingTest(
                          editingTest
                            ? {
                                ...editingTest,
                                marksPerQuestion: Number(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-duration">Duration (Minutes)</Label>
                    <Input
                      id="edit-duration"
                      type="number"
                      min="1"
                      value={editingTest?.duration || 60}
                      onChange={(e) =>
                        setEditingTest(
                          editingTest
                            ? {
                                ...editingTest,
                                duration: Number(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-negative-marking"
                      checked={editingTest?.negativeMarking || false}
                      onChange={(e) =>
                        setEditingTest(
                          editingTest
                            ? {
                                ...editingTest,
                                negativeMarking: e.target.checked,
                                negativeMarkingValue: e.target.checked
                                  ? editingTest.negativeMarkingValue
                                  : 0,
                              }
                            : null
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label
                      htmlFor="edit-negative-marking"
                      className="cursor-pointer"
                    >
                      Allow Negative Marking
                    </Label>
                  </div>

                  {editingTest?.negativeMarking && (
                    <div>
                      <Label htmlFor="edit-negative-value">
                        Negative Marks per Wrong Answer
                      </Label>
                      <Input
                        id="edit-negative-value"
                        type="number"
                        min="0"
                        step="0.25"
                        value={editingTest?.negativeMarkingValue || 0}
                        onChange={(e) =>
                          setEditingTest(
                            editingTest
                              ? {
                                  ...editingTest,
                                  negativeMarkingValue: Number(e.target.value),
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  )}
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


      <Separator />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <Card
              key={test.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() =>
                        setEditingTest({
                          id: test.id,
                          title: test.title,
                          marksPerQuestion: test.marksPerQuestion,
                          negativeMarking: test.negativeMarking,
                          negativeMarkingValue: test.negativeMarkingValue,
                          duration: test.duration,
                        })
                      }
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
                          <AlertDialogTitle>Delete Test</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{test.title}"? This
                            action cannot be undone and will remove all
                            associated questions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTest(test.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div>
                  <CardTitle className="text-lg leading-tight mb-2">
                    {test.title}
                  </CardTitle>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{test.questionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Marks/Q:</span>
                      <span className="font-medium">
                        {test.marksPerQuestion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Negative:</span>
                      <span className="font-medium">
                        {test.negativeMarking
                          ? `-${test.negativeMarkingValue}`
                          : "No"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1">
                      Created: {formatDate(test.dateCreated)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardFooter>
                <Link
                  className="w-full"
                  href={`/admin/exam/${examId}/${batchId}/${test.slug}`}
                >
                  <Button className="w-full" variant="secondary" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Questions
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Empty>
              <EmptyMedia>
                <FileText className="h-12 w-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No Tests Yet</EmptyTitle>
                <EmptyDescription>
                  Create your first test to get started
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setTestDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Test
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </section>
    </div>
  );
}
