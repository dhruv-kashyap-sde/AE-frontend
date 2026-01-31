"use client"

import { useState, useTransition } from "react"
import {
  Plus,
  FolderPlus,
  TrashIcon,
  PencilIcon,
  Eye,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { toast } from "sonner"
import { CategorySheet } from "./CategorySheet"
import {
  createExam,
  updateExam,
  deleteExam,
  refreshExams,
  refreshCategories,
} from "./actions"

// Types
interface Category {
  _id: string
  id: string
  title: string
  imageURL: string | null
}

interface Exam {
  _id: string
  id: string
  title: string
  slug: string
  imageURL: string | null
  category: Category
  totalBatches: number
  createdAt: string
}

interface ExamFormData {
  title: string
  categoryId: string
  imageURL: string
}

interface ExamManagementClientProps {
  initialExams: Exam[]
  initialCategories: Category[]
}

export default function ExamManagementClient({
  initialExams,
  initialCategories,
}: ExamManagementClientProps) {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  // Transition for server actions
  const [isPending, startTransition] = useTransition()

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ExamFormData>({
    title: "",
    categoryId: "",
    imageURL: "",
  })
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null)

  // Refresh categories when CategorySheet updates them
  const handleCategoriesChange = () => {
    startTransition(async () => {
      const result = await refreshCategories()
      if (result.success) {
        setCategories(result.data)
      }
    })
  }

  // Create exam
  const handleCreateExam = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter exam title")
      return
    }
    if (!formData.categoryId) {
      toast.error("Please select a category")
      return
    }

    startTransition(async () => {
      const result = await createExam({
        title: formData.title,
        category: formData.categoryId,
        imageURL: formData.imageURL || null,
      })

      if (result.success) {
        // Refresh exams list
        const examsResult = await refreshExams()
        if (examsResult.success) {
          setExams(examsResult.data)
        }

        toast.success("Exam created successfully")
        setCreateDialog(false)
        setFormData({ title: "", categoryId: "", imageURL: "" })
      } else {
        toast.error(result.error)
      }
    })
  }

  // Open edit dialog
  const openEditDialog = (exam: Exam) => {
    setEditingExam(exam)
    setFormData({
      title: exam.title,
      categoryId: exam.category._id || exam.category.id,
      imageURL: exam.imageURL || "",
    })
    setEditDialog(true)
  }

  // Update exam
  const handleUpdateExam = () => {
    if (!editingExam) return
    if (!formData.title.trim()) {
      toast.error("Please enter exam title")
      return
    }
    if (!formData.categoryId) {
      toast.error("Please select a category")
      return
    }

    const examId = editingExam._id || editingExam.id

    startTransition(async () => {
      const result = await updateExam(examId, {
        title: formData.title,
        category: formData.categoryId,
        imageURL: formData.imageURL || null,
      })

      if (result.success) {
        // Refresh exams list
        const examsResult = await refreshExams()
        if (examsResult.success) {
          setExams(examsResult.data)
        }

        toast.success("Exam updated successfully")
        setEditDialog(false)
        setEditingExam(null)
        setFormData({ title: "", categoryId: "", imageURL: "" })
      } else {
        toast.error(result.error)
      }
    })
  }

  // Open delete dialog
  const openDeleteDialog = (exam: Exam) => {
    setDeletingExam(exam)
    setDeleteDialog(true)
  }

  // Delete exam
  const handleDeleteExam = () => {
    if (!deletingExam) return

    const examId = deletingExam._id || deletingExam.id

    // Optimistic update - remove from UI immediately
    setExams((prev) => prev.filter((e) => e._id !== examId && e.id !== examId))
    setDeleteDialog(false)

    startTransition(async () => {
      const result = await deleteExam(examId)

      if (result.success) {
        toast.success("Exam deleted successfully")
        setDeletingExam(null)
      } else {
        // Revert optimistic update on failure
        const examsResult = await refreshExams()
        if (examsResult.success) {
          setExams(examsResult.data)
        }
        toast.error(result.error)
      }
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

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
          {/* Create Exam Dialog */}
          <Dialog open={createDialog} onOpenChange={setCreateDialog}>
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
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2" htmlFor="exam-category">
                      Category
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Category</SelectLabel>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat._id || cat.id}
                              value={cat._id || cat.id}
                            >
                              {cat.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2" htmlFor="exam-image">
                      Image URL
                    </Label>
                    <Input
                      id="exam-image"
                      placeholder="Enter image URL"
                      value={formData.imageURL}
                      onChange={(e) =>
                        setFormData({ ...formData, imageURL: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateExam} disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Exam
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Category Sheet */}
          <CategorySheet
            categories={categories}
            onCategoriesChange={handleCategoriesChange}
          />
        </div>
      </div>

      <Separator />

      {/* Exams Table */}
      <div className="bg-card border rounded-lg">
        <Table className="text-center">
          <TableHeader className="bg-transparent">
            <TableRow>
              <TableHead className="w-25 text-center">Logo</TableHead>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Total Batches</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <TableRow key={exam._id || exam.id}>
                  <TableCell className="font-medium">
                    <Avatar className="h-10 w-10 mx-auto">
                      <img
                        src={
                          exam.imageURL ||
                          "https://www.mockers.in/storage/exams/August2023/tNSML6LJjntagAE2hO3W.png"
                        }
                        alt={exam.title}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.category?.title || "N/A"}
                  </TableCell>
                  <TableCell>{exam.totalBatches}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(exam.createdAt)}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Link href={`exam/${exam.slug}`}>
                      <Button size="icon-sm" variant="ghost">
                        <Eye />
                      </Button>
                    </Link>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-primary hover:text-primary"
                      onClick={() => openEditDialog(exam)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(exam)}
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FolderPlus />
                      </EmptyMedia>
                      <EmptyTitle>No Exams</EmptyTitle>
                      <EmptyDescription>
                        {categories.length === 0
                          ? "Create a category first, then add exams"
                          : "Create your first exam"}
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button
                        onClick={() => setCreateDialog(true)}
                        variant="secondary"
                        disabled={categories.length === 0}
                      >
                        Create Exam
                      </Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>Update exam details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="edit-exam-title">
                Exam Title
              </Label>
              <Input
                id="edit-exam-title"
                placeholder="e.g., JEE Main 2025"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="edit-exam-category">
                  Category
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Category</SelectLabel>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat._id || cat.id}
                          value={cat._id || cat.id}
                        >
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2" htmlFor="edit-exam-image">
                  Image URL
                </Label>
                <Input
                  id="edit-exam-image"
                  placeholder="Enter image URL"
                  value={formData.imageURL}
                  onChange={(e) =>
                    setFormData({ ...formData, imageURL: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateExam} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingExam?.title}&quot;?
              This action cannot be undone.
              <p className="text-destructive mt-2">
                This will also delete all associated batches, tests, questions,
                and files.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
