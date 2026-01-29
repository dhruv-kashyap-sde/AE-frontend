"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Category {
  _id: string;
  title: string;
  imageURL?: string;
}

interface Exam {
  _id: string;
  title: string;
  slug: string;
  imageURL?: string;
  category: Category | string;
}

const ExamCategoryPopover = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, examsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/exams"),
        ]);
        
        const categoriesData = await categoriesRes.json();
        const examsData = await examsRes.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
          // Select first category by default
          if (categoriesData.data.length > 0) {
            setSelectedCategory(categoriesData.data[0]._id);
          }
        }
        
        if (examsData.success) {
          setExams(examsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Filter exams by selected category
  const filteredExams = exams.filter((exam) => {
    const categoryId = typeof exam.category === "object" 
      ? exam.category._id 
      : exam.category;
    return categoryId === selectedCategory;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="gap-1">
          <BookOpen className="h-4 w-4" />
          Exams
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No exam categories available
          </div>
        ) : (
          <div className="flex min-h-[300px]">
            {/* Categories sidebar */}
            <div className="w-1/3 border-r bg-muted/30">
              <div className="p-3 border-b">
                <h4 className="font-semibold text-sm">Categories</h4>
              </div>
              <div className="p-2 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category._id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.imageURL && (
                      <Avatar className="h-5 w-5">
                        <img src={category.imageURL} alt={category.title} />
                      </Avatar>
                    )}
                    <span className="truncate">{category.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exams list */}
            <div className="w-2/3">
              <div className="p-3 border-b">
                <h4 className="font-semibold text-sm">
                  {categories.find((c) => c._id === selectedCategory)?.title || "Exams"}
                </h4>
              </div>
              <div className="p-2">
                {filteredExams.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-3 text-center">
                    No exams in this category
                  </p>
                ) : (
                  <div className="space-y-1">
                    {filteredExams.map((exam) => (
                      <Link
                        key={exam._id}
                        href={`/exams/${exam.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {exam.imageURL && (
                          <Avatar className="h-8 w-8">
                            <img src={exam.imageURL} alt={exam.title} />
                          </Avatar>
                        )}
                        <span className="text-sm">{exam.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ExamCategoryPopover;