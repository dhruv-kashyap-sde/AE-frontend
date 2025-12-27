"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import readXlsxFile from "read-excel-file";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type Question = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
};

type UploadExcelProps = {
  onUpload: (questions: Question[]) => void;
};

export default function UploadExcel({ onUpload }: UploadExcelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");
    setPreviewQuestions([]);

    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const rows = await readXlsxFile(file);

      // Skip header row and parse questions
      if (rows.length < 2) {
        setError("Excel file must contain at least one question");
        setIsLoading(false);
        return;
      }

      // Validate header
      const header = rows[0];
      const expectedHeaders = [
        "question",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_option",
      ];

      const headerMatch = expectedHeaders.every((h, idx) => {
        const cellValue = header[idx]?.toString().toLowerCase().trim();
        return cellValue === h;
      });

      if (!headerMatch) {
        setError(
          "Invalid Excel format. Please ensure headers match: question, option_a, option_b, option_c, option_d, correct_option"
        );
        setIsLoading(false);
        return;
      }

      // Parse questions
      const parsedQuestions: Question[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        if (!row[0] || row.length < 6) continue; // Skip empty rows

        const correctOption = row[5]?.toString().toUpperCase().trim();

        if (!["A", "B", "C", "D"].includes(correctOption)) {
          setError(
            `Invalid correct_option at row ${i + 1}. Must be A, B, C, or D`
          );
          setIsLoading(false);
          return;
        }

        parsedQuestions.push({
          id: Date.now() + i,
          question: row[0]?.toString().trim() || "",
          option_a: row[1]?.toString().trim() || "",
          option_b: row[2]?.toString().trim() || "",
          option_c: row[3]?.toString().trim() || "",
          option_d: row[4]?.toString().trim() || "",
          correct_option: correctOption as "A" | "B" | "C" | "D",
        });
      }

      if (parsedQuestions.length === 0) {
        setError("No valid questions found in the Excel file");
      } else {
        setPreviewQuestions(parsedQuestions);
      }
    } catch (err) {
      setError("Failed to parse Excel file. Please check the file format.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    if (previewQuestions.length > 0) {
      onUpload(previewQuestions);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setPreviewQuestions([]);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Upload className="mr-2 h-4 w-4" /> Upload Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[calc(100vw-2rem)] lg:min-w-[80vw] max-h-[90vh] overflow-auto scrollbar ">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="contents">
            Upload Questions from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx or .xls) containing questions in the
            specified format below.
          </DialogDescription>
        </DialogHeader>
        <div className="md:flex gap-4">
          <div className=" md:w-1/2 space-y-6">
            {/* Expected Format Table */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Expected Excel Format:</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold text-muted-foreground">question</TableHead>
                      <TableHead className="font-bold text-muted-foreground">option_a</TableHead>
                      <TableHead className="font-bold text-muted-foreground">option_b</TableHead>
                      <TableHead className="font-bold text-muted-foreground">option_c</TableHead>
                      <TableHead className="font-bold text-muted-foreground">option_d</TableHead>
                      <TableHead className="font-bold text-muted-foreground">
                        correct_option
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="text-xs">
                      <TableCell className=" text-muted-foreground">What is 2+2?</TableCell>
                      <TableCell className=" text-muted-foreground">3</TableCell>
                      <TableCell className=" text-muted-foreground">4</TableCell>
                      <TableCell className=" text-muted-foreground">5</TableCell>
                      <TableCell className=" text-muted-foreground">6</TableCell>
                      <TableCell className=" text-muted-foreground">B</TableCell>
                    </TableRow>
                    <TableRow className="text-xs">
                      <TableCell className=" text-muted-foreground">Capital of India?</TableCell>
                      <TableCell className=" text-muted-foreground">Mumbai</TableCell>
                      <TableCell className=" text-muted-foreground">Delhi</TableCell>
                      <TableCell className=" text-muted-foreground">Kolkata</TableCell>
                      <TableCell className=" text-muted-foreground">Chennai</TableCell>
                      <TableCell className=" text-muted-foreground">B</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground">
                • First row must be headers (exactly as shown above)
                <br />• correct_option must be A, B, C, or D
              </p>
            </div>

            {/* File Upload Section */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <Label
                htmlFor="excel-upload"
                className="cursor-pointer text-sm font-medium hover:underline"
              >
                Click to upload or drag and drop
              </Label>
              <Input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Excel files only (.xlsx, .xls)
              </p>
              {selectedFile && (
                <Badge className="mt-4" variant="secondary">
                  {selectedFile.name}
                </Badge>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Parsing Excel file...
                </p>
              </div>
            )}
          </div>

            <Separator className="my-6 md:hidden" />
            <Separator orientation="vertical" className="my-6 hidden md:block" />
          <div className="md:w-1/2">
            {/* Preview Questions */}
            {previewQuestions.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    Preview ({previewQuestions.length} questions found)
                  </h3>
                  <Badge variant="default">{previewQuestions.length} Q's</Badge>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar space-y-3 border rounded-lg p-4 bg-muted/20">
                  {previewQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="border-b pb-3 last:border-0 bg-background rounded p-3"
                    >
                      <p className="font-medium mb-2">
                        Q{idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-bold">A)</span>{" "}
                          <span className="text-muted-foreground">{q.option_a}</span>
                          {q.correct_option === "A" && (
                            <Badge variant="default" className="ml-auto">
                              ✓ Correct
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-bold">B)</span>{" "}
                          <span className="text-muted-foreground">{q.option_b}</span>
                          {q.correct_option === "B" && (
                            <Badge variant="default" className="ml-auto">
                              ✓ Correct
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-bold">C)</span>{" "}
                          <span className="text-muted-foreground">{q.option_c}</span>
                          {q.correct_option === "C" && (
                            <Badge variant="default" className="ml-auto">
                              ✓ Correct
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-bold">D)</span>{" "}
                          <span className="text-muted-foreground">{q.option_d}</span>
                          {q.correct_option === "D" && (
                            <Badge variant="default" className="ml-auto">
                              ✓ Correct
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full w-full">Add file to see preview</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={previewQuestions.length === 0 || isLoading}
          >
            Upload {previewQuestions.length} Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
