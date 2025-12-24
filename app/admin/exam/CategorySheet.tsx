"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useState } from "react";
import { Pencil, Trash2, Check, X, ChevronLeft } from "lucide-react";

export function CategorySheet() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Engineering" },
    { id: 2, name: "Medical" },
    { id: 3, name: "Banking" },
    { id: 4, name: "Railway" },
    { id: 5, name: "SSC" },
    { id: 6, name: "Teaching" },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = () => {
    if (newCategoryName.trim()) {
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategoryName.trim() },
      ]);
      setNewCategoryName("");
    }
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingId ? { ...cat, name: editingName.trim() } : cat
        )
      );
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Categories <ChevronLeft /></Button>
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
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="ghost" onClick={handleCreate}>
                Create
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {/* Categories List */}
          <div className="space-y-3 mt-4 max-h-125 overflow-y-auto scrollbar">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              All Categories ({categories.length})
            </p>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between border-b transition-colors"
              >
                {editingId === category.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                      className="h-8 mr-2"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={handleSaveEdit}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm">
                        {category.name}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEdit(category.id, category.name)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
