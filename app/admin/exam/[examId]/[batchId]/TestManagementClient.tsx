"use client"

import React, { useState, useTransition } from "react"
import {
  FileText,
  Plus,
  TrashIcon,
  PencilIcon,
  Loader2,
} from "lucide-react"
import {
  createTest,
  updateTest,
  deleteTest,
  refreshTests,
} from "./actions"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"
import { toast } from "sonner"

interface Test {
  _id: string
  title: string
  slug: string
  marksPerQuestion: number
  negativeMarking: boolean
  negativeMarkValue: number
  duration: number
  questionCount: number
  createdAt: string
}

interface TestManagementClientProps {
  examId: string
  batchId: string
  initialTests: Test[]
}

export default function TestManagementClient({
  examId,
  batchId,
  initialTests,
}: TestManagementClientProps) {
  const [tests, setTests] = useState<Test[]>(initialTests)
  const [testDialog, setTestDialog] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Transition for server actions
  const [isPending, startTransition] = useTransition()

  const [newTest, setNewTest] = useState({
    title: "",
    marksPerQuestion: 1,
    negativeMarking: false,
    negativeMarkValue: 0,
    duration: 60,
  })

  const resetNewTest = () => {
    setNewTest({
      title: "",
      marksPerQuestion: 1,
      negativeMarking: false,
      negativeMarkValue: 0,
      duration: 60,
    })
  }

  const handleCreateTest = () => {
    if (!newTest.title.trim()) {
      toast.error("Test title is required")
      return
    }

    startTransition(async () => {
      const result = await createTest(examId, batchId, {
        title: newTest.title.trim(),
        marksPerQuestion: newTest.marksPerQuestion,
        negativeMarking: newTest.negativeMarking,
        negativeMarkValue: newTest.negativeMarking ? newTest.negativeMarkValue : 0,
        duration: newTest.duration,
      })

      if (result.success) {
        setTests([...tests, result.data])
        resetNewTest()
        setTestDialog(false)
        toast.success("Test created successfully")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleEditTest = () => {
    if (!editingTest || !editingTest.title.trim()) {
      toast.error("Test title is required")
      return
    }

    startTransition(async () => {
      const result = await updateTest(examId, batchId, editingTest._id, {
        title: editingTest.title.trim(),
        marksPerQuestion: editingTest.marksPerQuestion,
        negativeMarking: editingTest.negativeMarking,
        negativeMarkValue: editingTest.negativeMarking
          ? editingTest.negativeMarkValue
          : 0,
        duration: editingTest.duration,
      })

      if (result.success) {
        setTests(tests.map((test) => (test._id === editingTest._id ? result.data : test)))
        setEditingTest(null)
        toast.success("Test updated successfully")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDeleteTest = (id: string) => {
    setDeletingId(id)

    // Optimistic update
    setTests((prev) => prev.filter((test) => test._id !== id))

    startTransition(async () => {
      const result = await deleteTest(examId, batchId, id)

      if (result.success) {
        toast.success("Test deleted successfully")
      } else {
        // Revert on failure
        const testsResult = await refreshTests(batchId)
        if (testsResult.success) {
          setTests(testsResult.data)
        }
        toast.error(result.error)
      }
      setDeletingId(null)
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formFieldsJSX = (
    values: typeof newTest,
    onChange: (updates: Partial<typeof newTest>) => void,
    idPrefix: string
  ) => (
    <div className="space-y-4">
      <div>
        <Label className="mb-1" htmlFor={`${idPrefix}-title`}>
          Test Title
        </Label>
        <Input
          id={`${idPrefix}-title`}
          placeholder="e.g., Mock Test 1"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1" htmlFor={`${idPrefix}-marks`}>
            Marks per Question
          </Label>
          <Input
            id={`${idPrefix}-marks`}
            type="number"
            min="1"
            value={values.marksPerQuestion}
            onChange={(e) =>
              onChange({ marksPerQuestion: Number(e.target.value) || 1 })
            }
          />
        </div>

        <div>
          <Label className="mb-1" htmlFor={`${idPrefix}-duration`}>
            Duration (Minutes)
          </Label>
          <Input
            id={`${idPrefix}-duration`}
            type="number"
            min="1"
            value={values.duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) || 1 })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`${idPrefix}-negative`}
            checked={values.negativeMarking}
            onChange={(e) =>
              onChange({
                negativeMarking: e.target.checked,
                negativeMarkValue: e.target.checked ? values.negativeMarkValue : 0,
              })
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor={`${idPrefix}-negative`} className="cursor-pointer mb-0">
            Allow Negative Marking
          </Label>
        </div>

        {values.negativeMarking && (
          <div>
            <Label className="mb-1" htmlFor={`${idPrefix}-negative-value`}>
              Negative Marks per Wrong Answer
            </Label>
            <Input
              id={`${idPrefix}-negative-value`}
              type="number"
              min="0"
              step="0.25"
              value={values.negativeMarkValue}
              onChange={(e) =>
                onChange({ negativeMarkValue: Number(e.target.value) || 0 })
              }
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Create and manage Tests
          </p>
        </div>

        <Dialog open={testDialog} onOpenChange={setTestDialog}>
          <Button variant="secondary" onClick={() => setTestDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Test
          </Button>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Test</DialogTitle>
              <DialogDescription>
                Configure test settings and parameters
              </DialogDescription>
            </DialogHeader>
            {formFieldsJSX(newTest, (updates) => setNewTest({ ...newTest, ...updates }), "create")}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setTestDialog(false)
                  resetNewTest()
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTest} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
          {editingTest &&
            formFieldsJSX(
              editingTest,
              (updates) => setEditingTest({ ...editingTest, ...updates }),
              "edit"
            )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTest(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTest} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tests.length > 0 ? (
          tests.map((test) => (
            <Card
              key={test._id}
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
                      onClick={() => setEditingTest(test)}
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
                            Are you sure you want to delete &quot;{test.title}&quot;? This
                            action cannot be undone and will remove all
                            associated questions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTest(test._id)}
                            disabled={deletingId === test._id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === test._id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
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
                      <span className="font-medium">{test.marksPerQuestion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{test.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Negative:</span>
                      <span className="font-medium">
                        {test.negativeMarking ? `-${test.negativeMarkValue}` : "No"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1">
                      Created: {formatDate(test.createdAt)}
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
    </>
  )
}
