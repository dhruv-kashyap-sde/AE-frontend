"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Loader2, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

interface SearchResult {
  _id: string
  title: string
  slug: string
  imageURL: string | null
  totalBatches: number
  category: {
    _id: string
    title: string
  }
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onOpenChange])

  // Debounced search function
  const searchExams = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([])
      setError("")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/exams/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to search")
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce input changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      searchExams(query)
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, searchExams])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setError("")
    }
  }, [open])

  const handleExamClick = (slug: string) => {
    onOpenChange(false)
    router.push(`/exam/${slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 top-0 mt-16 translate-y-0">

        <div className="py-2 px-0 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search for exams (e.g., SBI, JEE, NEET)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 placeholder:bg-transparent selection:bg-primary outline-none border-transparent w-full"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="max-h-100 overflow-y-auto px-6 py-4">
          {!query && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Start typing to search for exams</p>
              <p className="text-sm mt-1">Try searching for "SBI", "JEE", "NEET"</p>
            </div>
          )}

          {query && query.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Type at least 2 characters to search</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && !error && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No exams found matching &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((exam) => (
                <Card
                  key={exam._id}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors border-2 hover:border-primary/50"
                  onClick={() => handleExamClick(exam.slug)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="truncate">{exam.category.title}</span>
                        <span>•</span>
                        <span>
                          {exam.totalBatches} {exam.totalBatches === 1 ? "batch" : "batches"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="px-6 py-3 border-t bg-muted/50 text-xs text-muted-foreground text-center">
            Showing {results.length} result{results.length !== 1 ? "s" : ""}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
