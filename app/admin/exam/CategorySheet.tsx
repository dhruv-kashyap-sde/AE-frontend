"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useState, useTransition } from "react"
import { Pencil, Trash2, Check, X, ChevronLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
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
import {
  createCategory,
  updateCategory,
  deleteCategory,
  refreshCategories,
} from "./actions"

interface Category {
  _id: string
  id: string
  title: string
  imageURL: string | null
}

interface CategorySheetProps {
  categories: Category[]
  onCategoriesChange: () => void
}

export function CategorySheet({
  categories: initialCategories,
  onCategoriesChange,
}: CategorySheetProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  )

  // Transition for server actions
  const [isPending, startTransition] = useTransition()

  // Sync with parent when initialCategories changes
  useState(() => {
    setCategories(initialCategories)
  })

  const handleCreate = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter category name")
      return
    }

    startTransition(async () => {
      const result = await createCategory({ title: newCategoryName.trim() })

      if (result.success) {
        // Refresh categories
        const categoriesResult = await refreshCategories()
        if (categoriesResult.success) {
          setCategories(categoriesResult.data)
        }
        setNewCategoryName("")
        onCategoriesChange()
        toast.success("Category created successfully")
      } else {
        toast.error(result.error)
      }
    })
  }

  const openDeleteDialog = (category: Category) => {
    setDeletingCategory(category)
    setDeleteDialog(true)
  }

  const handleDelete = () => {
    if (!deletingCategory) return

    const categoryId = deletingCategory._id || deletingCategory.id

    // Optimistic update
    setCategories((prev) =>
      prev.filter((cat) => cat._id !== categoryId && cat.id !== categoryId)
    )
    setDeleteDialog(false)

    startTransition(async () => {
      const result = await deleteCategory(categoryId)

      if (result.success) {
        onCategoriesChange()
        toast.success("Category deleted successfully")
        setDeletingCategory(null)
      } else {
        // Revert optimistic update
        const categoriesResult = await refreshCategories()
        if (categoriesResult.success) {
          setCategories(categoriesResult.data)
        }
        toast.error(result.error)
      }
    })
  }

  const handleEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = () => {
    if (!editingName.trim() || !editingId) return

    startTransition(async () => {
      const result = await updateCategory(editingId, {
        title: editingName.trim(),
      })

      if (result.success) {
        // Refresh categories
        const categoriesResult = await refreshCategories()
        if (categoriesResult.success) {
          setCategories(categoriesResult.data)
        }
        setEditingId(null)
        setEditingName("")
        onCategoriesChange()
        toast.success("Category updated successfully")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            Categories <ChevronLeft />
          </Button>
        </SheetTrigger>
        <SheetContent className="gap-1 sm:max-w-lg">
          <SheetHeader className="pb-2">
            <SheetTitle>Categories</SheetTitle>
            <Separator />
          </SheetHeader>
          <div className="px-4 flex flex-col gap-4">
            {/* Create Category */}
            <InputGroup>
              <InputGroupInput
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isPending) {
                    handleCreate()
                  }
                }}
                disabled={isPending}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="ghost"
                  onClick={handleCreate}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {/* Categories List */}
            <div className="space-y-3 mt-4 max-h-125 overflow-y-auto scrollbar">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                All Categories ({categories.length})
              </p>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No categories yet. Create one above.
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category._id || category.id}
                    className="flex items-center justify-between border-b transition-colors"
                  >
                    {editingId === (category._id || category.id) ? (
                      <>
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isPending) {
                              handleSaveEdit()
                            } else if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                          className="h-8 mr-2"
                          autoFocus
                          disabled={isPending}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={handleSaveEdit}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleCancelEdit}
                            disabled={isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm py-2">{category.title}</div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() =>
                              handleEdit(
                                category._id || category.id,
                                category.title
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteDialog(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.title}
              &quot;? This action cannot be undone. Categories with existing
              exams cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
