"use client"

import React, { useState, useRef } from "react"
import {
  FileIcon,
  Plus,
  TrashIcon,
  PencilIcon,
  Loader2,
  UploadCloud,
  FileImage,
  FileText as FileTextIcon,
  File,
  Download,
  Eye,
} from "lucide-react"
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
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface BatchFile {
  _id: string
  title: string
  fileURL: string
  fileName: string
  fileType: "pdf" | "image" | "document" | "other"
  fileSize: number
  mimeType: string
  createdAt: string
}

interface FileManagementClientProps {
  examId: string
  batchId: string
  initialFiles: BatchFile[]
}

export default function FileManagementClient({
  examId,
  batchId,
  initialFiles,
}: FileManagementClientProps) {
  const [files, setFiles] = useState<BatchFile[]>(initialFiles)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [editingFile, setEditingFile] = useState<BatchFile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newFile, setNewFile] = useState({
    title: "",
    file: null as File | null,
  })

  const resetNewFile = () => {
    setNewFile({
      title: "",
      file: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileTextIcon className="h-6 w-6 text-red-500" />
      case "image":
        return <FileImage className="h-6 w-6 text-blue-500" />
      case "document":
        return <FileIcon className="h-6 w-6 text-green-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const getFileTypeBadge = (fileType: string) => {
    const colors: Record<string, string> = {
      pdf: "bg-red-100 text-red-700",
      image: "bg-blue-100 text-blue-700",
      document: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700",
    }
    return colors[fileType] || colors.other
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewFile({
        ...newFile,
        file,
        title: newFile.title || file.name.replace(/\.[^/.]+$/, ""),
      })
    }
  }

  const handleUploadFile = async () => {
    if (!newFile.title.trim()) {
      toast.error("File title is required")
      return
    }

    if (!newFile.file) {
      toast.error("Please select a file to upload")
      return
    }

    setIsUploading(true)
    try {
      // TODO: Implement actual file upload to cloud storage (e.g., S3, Cloudinary)
      // For now, we'll simulate with a placeholder URL
      // In production, you would:
      // 1. Upload file to cloud storage
      // 2. Get the URL back
      // 3. Save the file metadata to database

      // Simulating file upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Placeholder URL - replace with actual upload logic
      const placeholderURL = `https://storage.example.com/files/${Date.now()}-${newFile.file.name}`

      const res = await fetch(`/api/admin/exams/${examId}/batches/${batchId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newFile.title.trim(),
          fileURL: placeholderURL,
          fileName: newFile.file.name,
          fileSize: newFile.file.size,
          mimeType: newFile.file.type,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file")
      }

      setFiles([...files, data.data])
      resetNewFile()
      setUploadDialog(false)
      toast.success("File uploaded successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditFile = async () => {
    if (!editingFile || !editingFile.title.trim()) {
      toast.error("File title is required")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/admin/exams/${examId}/batches/${batchId}/files/${editingFile._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingFile.title.trim(),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update file")
      }

      setFiles(files.map((file) => (file._id === editingFile._id ? data.data : file)))
      setEditingFile(null)
      toast.success("File updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFile = async (id: string) => {
    setDeletingId(id)
    try {
      // TODO: Also delete from cloud storage

      const res = await fetch(
        `/api/admin/exams/${examId}/batches/${batchId}/files/${id}`,
        { method: "DELETE" }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete file")
      }

      setFiles(files.filter((file) => file._id !== id))
      toast.success("File deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Upload and manage Files
          </p>
        </div>

        <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
          <Button variant="secondary" onClick={() => setUploadDialog(true)}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload File
          </Button>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
              <DialogDescription>
                Upload a PDF, image, or document
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-1" htmlFor="file-title">
                  File Title
                </Label>
                <Input
                  id="file-title"
                  placeholder="e.g., Study Material Chapter 1"
                  value={newFile.title}
                  onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-1" htmlFor="file-upload">
                  Select File
                </Label>
                <div className="mt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file-upload"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    {newFile.file ? (
                      <div className="space-y-2">
                        <FileIcon className="h-8 w-8 mx-auto text-gray-500" />
                        <p className="text-sm font-medium truncate">{newFile.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(newFile.file.size)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-muted-foreground">
                          Click to select a file
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, Images, Documents (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadDialog(false)
                  resetNewFile()
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUploadFile} disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingFile}
        onOpenChange={(open) => !open && setEditingFile(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit File</DialogTitle>
            <DialogDescription>Update file title</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1" htmlFor="edit-file-title">
                File Title
              </Label>
              <Input
                id="edit-file-title"
                placeholder="e.g., Study Material Chapter 1"
                value={editingFile?.title || ""}
                onChange={(e) =>
                  setEditingFile(
                    editingFile ? { ...editingFile, title: e.target.value } : null
                  )
                }
              />
            </div>
            {editingFile && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium truncate">{editingFile.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(editingFile.fileSize)} • {editingFile.mimeType}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingFile(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditFile} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.length > 0 ? (
          files.map((file) => (
            <Card
              key={file._id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setEditingFile(file)}
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
                          <AlertDialogTitle>Delete File</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{file.title}&quot;? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteFile(file._id)}
                            disabled={deletingId === file._id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === file._id && (
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
                    {file.title}
                  </CardTitle>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-muted-foreground truncate text-xs">
                      {file.fileName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{formatFileSize(file.fileSize)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge className={getFileTypeBadge(file.fileType)} variant="secondary">
                        {file.fileType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1">
                      Uploaded: {formatDate(file.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.fileURL, "_blank")}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  className="flex-1"
                  variant="secondary"
                  size="sm"
                  asChild
                >
                  <a href={file.fileURL} download={file.fileName}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Empty>
              <EmptyMedia>
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No Files Yet</EmptyTitle>
                <EmptyDescription>
                  Upload your first file to get started
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setUploadDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Upload File
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </section>
    </>
  )
}
