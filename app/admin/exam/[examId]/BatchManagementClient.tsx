"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  FileText,
  File,
  TrashIcon,
  PencilIcon,
  Loader2,
  Calendar,
  IndianRupee,
  FolderIcon,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

// Types
interface Exam {
  _id: string;
  id: string;
  title: string;
  slug: string;
  imageURL: string | null;
}

interface Batch {
  _id: string;
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  expiry: string | null;
  contentType: "test" | "file";
  totalCount: number;
  description: string | null;
  createdAt: string;
}

interface BatchFormData {
  title: string;
  price: string;
  originalPrice: string;
  expiry: string;
  contentType: "test" | "file";
  description: string;
}

interface BatchManagementClientProps {
  exam: Exam;
  initialBatches: Batch[];
}

const initialFormData: BatchFormData = {
  title: "",
  price: "",
  originalPrice: "",
  expiry: "",
  contentType: "test",
  description: "",
};

export default function BatchManagementClient({
  exam,
  initialBatches,
}: BatchManagementClientProps) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BatchFormData>(initialFormData);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create batch
  const handleCreateBatch = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter batch title");
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!formData.originalPrice || parseFloat(formData.originalPrice) < 0) {
      toast.error("Please enter a valid original price");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`/api/admin/exams/${exam._id || exam.id}/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          price: parseFloat(formData.price),
          originalPrice: parseFloat(formData.originalPrice),
          expiry: formData.expiry || null,
          contentType: formData.contentType,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create batch");
      }

      // Refresh batches list
      const batchesResponse = await fetch(`/api/admin/exams/${exam._id || exam.id}/batches`);
      if (batchesResponse.ok) {
        const data = await batchesResponse.json();
        setBatches(data.data);
      }

      toast.success("Batch created successfully");
      setCreateDialog(false);
      setFormData(initialFormData);
    } catch (error: any) {
      toast.error(error.message || "Failed to create batch");
    } finally {
      setIsCreating(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      title: batch.title,
      price: batch.price.toString(),
      originalPrice: batch.originalPrice.toString(),
      expiry: batch.expiry ? batch.expiry.split("T")[0] : "",
      contentType: batch.contentType,
      description: batch.description || "",
    });
    setEditDialog(true);
  };

  // Update batch
  const handleUpdateBatch = async () => {
    if (!editingBatch) return;
    if (!formData.title.trim()) {
      toast.error("Please enter batch title");
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!formData.originalPrice || parseFloat(formData.originalPrice) < 0) {
      toast.error("Please enter a valid original price");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/admin/exams/${exam._id || exam.id}/batches/${editingBatch._id || editingBatch.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            price: parseFloat(formData.price),
            originalPrice: parseFloat(formData.originalPrice),
            expiry: formData.expiry || null,
            contentType: formData.contentType,
            description: formData.description || null,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update batch");
      }

      // Refresh batches list
      const batchesResponse = await fetch(`/api/admin/exams/${exam._id || exam.id}/batches`);
      if (batchesResponse.ok) {
        const data = await batchesResponse.json();
        setBatches(data.data);
      }

      toast.success("Batch updated successfully");
      setEditDialog(false);
      setEditingBatch(null);
      setFormData(initialFormData);
    } catch (error: any) {
      toast.error(error.message || "Failed to update batch");
    } finally {
      setIsUpdating(false);
    }
  };

  // Open delete dialog
  const openDeleteDialog = (batch: Batch) => {
    setDeletingBatch(batch);
    setDeleteDialog(true);
  };

  // Delete batch
  const handleDeleteBatch = async () => {
    if (!deletingBatch) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/exams/${exam._id || exam.id}/batches/${deletingBatch._id || deletingBatch.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete batch");
      }

      setBatches(batches.filter((b) => b._id !== deletingBatch._id && b.id !== deletingBatch.id));
      toast.success("Batch deleted successfully");
      setDeleteDialog(false);
      setDeletingBatch(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete batch");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate discount percentage
  const getDiscount = (price: number, originalPrice: number) => {
    if (originalPrice <= 0 || price >= originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Check if batch is expired
  const isExpired = (expiry: string | null) => {
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  };

  // Form fields JSX - inlined to avoid re-render focus loss
  const formFieldsJSX = (idPrefix: string) => (
    <div className="space-y-4">
      <div>
        <Label className="mb-2" htmlFor={`${idPrefix}-title`}>
          Batch Title *
        </Label>
        <Input
          id={`${idPrefix}-title`}
          placeholder="e.g., Batch 2025-26"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2" htmlFor={`${idPrefix}-price`}>
            Price (₹) *
          </Label>
          <Input
            id={`${idPrefix}-price`}
            type="number"
            min="0"
            placeholder="299"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor={`${idPrefix}-original-price`}>
            Original Price (₹) *
          </Label>
          <Input
            id={`${idPrefix}-original-price`}
            type="number"
            min="0"
            placeholder="599"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2" htmlFor={`${idPrefix}-content-type`}>
            Content Type *
          </Label>
          <Select
            value={formData.contentType}
            onValueChange={(value: "test" | "file") =>
              setFormData({ ...formData, contentType: value })
            }
          >
            <SelectTrigger id={`${idPrefix}-content-type`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test">Tests</SelectItem>
              <SelectItem value="file">Files</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2" htmlFor={`${idPrefix}-expiry`}>
            Expiry Date
          </Label>
          <Input
            id={`${idPrefix}-expiry`}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.expiry}
            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2" htmlFor={`${idPrefix}-description`}>
          Description
        </Label>
        <Textarea
          id={`${idPrefix}-description`}
          placeholder="Optional description for this batch..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 overflow-y-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/exam">Exams</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{exam.title}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-4">
          {exam.imageURL && (
            <Avatar className="h-12 w-12">
              <img src={exam.imageURL} alt={exam.title} />
            </Avatar>
          )}
          <div>
            <h2 className="md:text-2xl font-bold">{exam.title}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Create and manage batches for this exam
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Create Batch Dialog */}
          <Dialog open={createDialog} onOpenChange={setCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Create Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Batch</DialogTitle>
                <DialogDescription>
                  Add a new batch to organize tests or files
                </DialogDescription>
              </DialogHeader>
              {formFieldsJSX("create-batch")}
              <DialogFooter>
                <Button onClick={handleCreateBatch} disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Batch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {/* Batches Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {batches.length > 0 ? (
          batches.map((batch) => {
            const discount = getDiscount(batch.price, batch.originalPrice);
            const expired = isExpired(batch.expiry);

            return (
              <Card
                key={batch._id || batch.id}
                className={`hover:shadow-lg transition-shadow flex flex-col ${expired ? "opacity-60" : ""}`}
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FolderIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openEditDialog(batch)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(batch)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg leading-tight">
                        {batch.title}
                      </CardTitle>
                      {expired && (
                        <Badge variant="destructive" className="text-xs">
                          Expired
                        </Badge>
                      )}
                    </div>

                    {/* Content type and count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {batch.contentType === "test" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                      <span>
                        {batch.totalCount} {batch.contentType === "test" ? "tests" : "files"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {batch.price}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground line-through flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {batch.originalPrice}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            {discount}% off
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Expiry */}
                    {batch.expiry && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {formatDate(batch.expiry)}</span>
                      </div>
                    )}

                    {/* Description */}
                    {batch.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {batch.description}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardFooter className="pt-0 mt-auto">
                  <Link href={`/admin/exam/${exam.slug}/${batch.slug}`} className="w-full">
                    <Button className="w-full" variant="outline" size="sm">
                      View {batch.contentType === "test" ? "Tests" : "Files"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Empty>
              <EmptyMedia>
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No Batches Yet</EmptyTitle>
                <EmptyDescription>
                  Create your first batch to organize tests or files
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Batch
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </section>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>Update batch details</DialogDescription>
          </DialogHeader>
          {formFieldsJSX("edit-batch")}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBatch} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingBatch?.title}&quot;? This action
              cannot be undone and will remove all associated content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBatch}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
