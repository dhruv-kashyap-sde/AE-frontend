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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
export default function page({ params }: { params: Promise<{ examId: string }> }) {
    const { examId } = React.use(params);
  const [batches, setBatches] = useState<
    Array<{
      id: number;
      title: string;
      slug: string;
      testCount: number;
      dateCreated: string;
    }>
  >([
    {
      id: 1,
      title: "Batch 2025 - Morning",
        slug: "batch-2025-morning",
      testCount: 15,
      dateCreated: "2024-01-15",
    },
    {
      id: 2,
      title: "Batch 2025 - Evening",
        slug: "batch-2025-evening",
      testCount: 12,
      dateCreated: "2024-02-20",
    },
    {
      id: 3,
      title: "Batch 2024 - Practice",
        slug: "batch-2024-practice",
      testCount: 8,
      dateCreated: "2024-03-10",
    },
  ]);
  const [batchDialog, setBatchDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [newBatch, setNewBatch] = useState({
    title: "",
  });

  const handleCreateBatch = () => {
    if (newBatch.title.trim()) {
      setBatches([
        ...batches,
        {
          id: Date.now(),
          title: newBatch.title,
          testCount: 0,
          dateCreated: new Date().toISOString().split("T")[0],
            slug: newBatch.title.toLowerCase().replace(/\s+/g, "-"),
        },
      ]);
      setNewBatch({ title: "" });
      setBatchDialog(false);
    }
  };

  const handleEditBatch = () => {
    if (editingBatch && editingBatch.title.trim()) {
      setBatches(
        batches.map((batch) =>
          batch.id === editingBatch.id
            ? { ...batch, title: editingBatch.title }
            : batch
        )
      );
      setEditingBatch(null);
    }
  };

  const handleDeleteBatch = (id: number) => {
    setBatches(batches.filter((batch) => batch.id !== id));
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
            <BreadcrumbPage>
              Exam Title
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">Exam Title</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Create and manage batches</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Create Batch */}
          <Dialog open={batchDialog} onOpenChange={setBatchDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Create Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Batch</DialogTitle>
                <DialogDescription>
                  Add a new batch to organize your tests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2" htmlFor="batch-title">
                    Batch Title
                  </Label>
                  <Input
                    id="batch-title"
                    placeholder="e.g., Batch 2025 - Morning"
                    value={newBatch.title}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, title: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateBatch();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateBatch}>Create Batch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog
            open={!!editingBatch}
            onOpenChange={(open) => !open && setEditingBatch(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Batch</DialogTitle>
                <DialogDescription>Update batch information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2" htmlFor="edit-batch-title">
                    Batch Title
                  </Label>
                  <Input
                    id="edit-batch-title"
                    placeholder="e.g., Batch 2025 - Morning"
                    value={editingBatch?.title || ""}
                    onChange={(e) =>
                      setEditingBatch(
                        editingBatch
                          ? { ...editingBatch, title: e.target.value }
                          : null
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditBatch();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingBatch(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBatch}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {batches.length > 0 ? (
          batches.map((batch) => (
            <Card
              key={batch.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() =>
                        setEditingBatch({ id: batch.id, title: batch.title })
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
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Do you want to delete the batch <span className="font-bold">"{batch.title}"</span>? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            asChild
                            onClick={() => handleDeleteBatch(batch.id)}
                          >
                            <Button variant={"destructive"}>Continue</Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div>
                  <CardTitle className="text-lg leading-tight mb-1">
                    {batch.title}
                  </CardTitle>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>
                        {batch.testCount}{" "}
                        {batch.testCount === 1 ? "test" : "tests"}
                      </span>
                    </div>
                    <div className="text-xs">
                      Created: {formatDate(batch.dateCreated)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="pt-0 mt-auto">
                <Link href={`/admin/exam/${examId}/${batch.slug}`}>
                <Button className="w-full" variant="outline" size="sm">
                  View All Tests
                </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Empty>
              <EmptyMedia>
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No Batches Yet</EmptyTitle>
                <EmptyDescription>
                  Create your first batch to organize tests
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setBatchDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Batch
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </section>
    </div>
  );
}
