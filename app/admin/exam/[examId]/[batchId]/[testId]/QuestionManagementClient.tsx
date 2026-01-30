"use client"

import React, { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  PencilIcon,
  TrashIcon,
  Image as ImageIcon,
  X,
  Loader2,
  Upload,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import SmartText from "./SmartText"
import UploadExcel from "./UploadExcel"

type CorrectOption = "A" | "B" | "C" | "D"

interface Question {
  _id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: CorrectOption
  imageURL: string | null
  order: number
}

interface Test {
  _id: string
  title: string
  marksPerQuestion: number
  negativeMarking: boolean
  negativeMarkValue: number
  duration: number
  questionCount: number
}

interface QuestionManagementClientProps {
  examId: string
  batchId: string
  testId: string
  test: Test
  initialQuestions: Question[]
}

export default function QuestionManagementClient({
  examId,
  batchId,
  testId,
  test,
  initialQuestions,
}: QuestionManagementClientProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 20
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Image handling
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A" as CorrectOption,
  })

  const resetNewQuestion = () => {
    setNewQuestion({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "A",
    })
    setSelectedImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 5MB.")
        return
      }

      setSelectedImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (editFileInputRef.current) editFileInputRef.current.value = ""
  }

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      toast.error("Question text is required")
      return
    }
    if (!newQuestion.optionA.trim() || !newQuestion.optionB.trim() || 
        !newQuestion.optionC.trim() || !newQuestion.optionD.trim()) {
      toast.error("All options are required")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/admin/exams/${examId}/batches/${batchId}/tests/${testId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: newQuestion.question.trim(),
            optionA: newQuestion.optionA.trim(),
            optionB: newQuestion.optionB.trim(),
            optionC: newQuestion.optionC.trim(),
            optionD: newQuestion.optionD.trim(),
            correctOption: newQuestion.correctOption,
            image: imagePreview, // base64 string
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add question")
      }

      setQuestions([...questions, data.data])
      resetNewQuestion()
      setIsAddDialogOpen(false)
      toast.success("Question added successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to add question")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditQuestion = async () => {
    if (!editingQuestion) return

    if (!editingQuestion.question.trim()) {
      toast.error("Question text is required")
      return
    }
    if (!editingQuestion.optionA.trim() || !editingQuestion.optionB.trim() || 
        !editingQuestion.optionC.trim() || !editingQuestion.optionD.trim()) {
      toast.error("All options are required")
      return
    }

    setIsLoading(true)
    try {
      const updateData: any = {
        question: editingQuestion.question.trim(),
        optionA: editingQuestion.optionA.trim(),
        optionB: editingQuestion.optionB.trim(),
        optionC: editingQuestion.optionC.trim(),
        optionD: editingQuestion.optionD.trim(),
        correctOption: editingQuestion.correctOption,
      }

      // Handle image
      if (imagePreview && imagePreview.startsWith("data:image")) {
        updateData.image = imagePreview
      } else if (!imagePreview && editingQuestion.imageURL) {
        updateData.removeImage = true
      }

      const res = await fetch(
        `/api/admin/exams/${examId}/batches/${batchId}/tests/${testId}/questions/${editingQuestion._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update question")
      }

      setQuestions(questions.map((q) => (q._id === editingQuestion._id ? data.data : q)))
      setEditingQuestion(null)
      setIsEditDialogOpen(false)
      setSelectedImageFile(null)
      setImagePreview(null)
      toast.success("Question updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update question")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(
        `/api/admin/exams/${examId}/batches/${batchId}/tests/${testId}/questions/${id}`,
        { method: "DELETE" }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete question")
      }

      setQuestions(questions.filter((q) => q._id !== id))
      toast.success("Question deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete question")
    } finally {
      setDeletingId(null)
    }
  }

  const handleExcelUpload = async (uploadedQuestions: Array<{
    question: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctOption: CorrectOption
  }>) => {
    if (uploadedQuestions.length === 0) {
      toast.error("No valid questions found in the file")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/admin/exams/${examId}/batches/${batchId}/tests/${testId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: uploadedQuestions }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload questions")
      }

      setQuestions([...questions, ...data.data])
      toast.success(data.message || `${uploadedQuestions.length} questions added successfully`)
    } catch (error: any) {
      toast.error(error.message || "Failed to upload questions")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question)
    setImagePreview(question.imageURL)
    setIsEditDialogOpen(true)
  }

  // Filtering and pagination
  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion)
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="md:text-2xl font-bold">{test.title}</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Add questions to this test and manage its settings.
          </p>
        </div>

        <div className="flex gap-2">
          {/* Upload Excel Dialog */}
          <UploadExcel onUpload={handleExcelUpload} isLoading={isLoading} />

          {/* Add Question Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button variant="secondary" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
                <DialogDescription>Enter question details</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-question">Question</Label>
                  <Textarea
                    id="new-question"
                    placeholder="Enter your question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-optionA">Option A</Label>
                    <Input
                      id="new-optionA"
                      value={newQuestion.optionA}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-optionB">Option B</Label>
                    <Input
                      id="new-optionB"
                      value={newQuestion.optionB}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-optionC">Option C</Label>
                    <Input
                      id="new-optionC"
                      value={newQuestion.optionC}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-optionD">Option D</Label>
                    <Input
                      id="new-optionD"
                      value={newQuestion.optionD}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-correct">Correct Option</Label>
                  <Select
                    value={newQuestion.correctOption}
                    onValueChange={(value: CorrectOption) =>
                      setNewQuestion({ ...newQuestion, correctOption: value })
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
                  <Label htmlFor="new-image">Attach Image (optional)</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    id="new-image"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={imagePreview}
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

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetNewQuestion()
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Question Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                        setEditingQuestion({ ...editingQuestion, question: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-optionA">Option A</Label>
                      <Input
                        id="edit-optionA"
                        value={editingQuestion.optionA}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, optionA: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-optionB">Option B</Label>
                      <Input
                        id="edit-optionB"
                        value={editingQuestion.optionB}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, optionB: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-optionC">Option C</Label>
                      <Input
                        id="edit-optionC"
                        value={editingQuestion.optionC}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, optionC: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-optionD">Option D</Label>
                      <Input
                        id="edit-optionD"
                        value={editingQuestion.optionD}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, optionD: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-correct">Correct Option</Label>
                    <Select
                      value={editingQuestion.correctOption}
                      onValueChange={(value: CorrectOption) =>
                        setEditingQuestion({ ...editingQuestion, correctOption: value })
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
                    <Label htmlFor="edit-image">Attach Image (optional)</Label>
                    <Input
                      ref={editFileInputRef}
                      type="file"
                      id="edit-image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="mt-3 relative inline-block">
                        <img
                          src={imagePreview}
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
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingQuestion(null)
                    setSelectedImageFile(null)
                    setImagePreview(null)
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditQuestion} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="text-muted-foreground text-xs grid grid-cols-2 md:grid-cols-4 md:w-fit gap-2">
        <p>
          Questions: <span className="font-bold">{questions.length}</span>
        </p>
        <p>
          Marks/Q: <span className="font-bold">{test.marksPerQuestion}</span>
        </p>
        <p>
          Duration: <span className="font-bold">{test.duration} min</span>
        </p>
        <p>
          Negative: <span className="font-bold">{test.negativeMarking ? `-${test.negativeMarkValue}` : "No"}</span>
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
                setSearchQuery(e.target.value)
                setCurrentPage(1)
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
                <TableHead className="w-24">Correct</TableHead>
                <TableHead className="w-16 text-center">Image</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentQuestions.length > 0 ? (
                currentQuestions.map((question, idx) => (
                  <TableRow key={question._id}>
                    <TableCell className="font-medium">
                      {indexOfFirstQuestion + idx + 1}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-md">
                      <SmartText text={question.question} />
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.optionA} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.optionB} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.optionC} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground">
                        <SmartText text={question.optionD} />
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{question.correctOption}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {question.imageURL ? (
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
                          onClick={() => openEditDialog(question)}
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
                              <AlertDialogTitle>Delete Question</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this question? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuestion(question._id)}
                                disabled={deletingId === question._id}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId === question._id && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
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
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchQuery ? "No questions match your search" : "No questions yet. Add some questions to get started."}
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
                <span className="text-sm text-muted-foreground">of {totalPages || 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
