"use client";

import { ChevronLeftIcon, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TestItem {
  id: string;
  title: string;
  slug: string;
  duration: number;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarkValue: number;
  totalMarks: number;
}

const JEEInstructions = ({ test }: { test: TestItem }) => {
  const positiveMark = test.marksPerQuestion;
  const negativeMark = test.negativeMarking ? test.negativeMarkValue : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <Play className="mr-2 h-4 w-4" />
          Start Test
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b bg-muted/30 px-6 py-4 text-lg font-semibold tracking-tight">
            JEE Instructions
          </DialogTitle>
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <DialogDescription asChild>
              <div className="space-y-6 p-6">
                <section className="rounded-lg border bg-card p-4">
                  <h3 className="text-foreground text-base font-semibold">
                    Please read these instructions carefully. The timer starts
                    as soon as you begin the test.
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground"></p>

                  <section className="grid sm:grid-cols-2">
                    <div className="rounded-md py-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Test
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {test.title}
                      </p>
                    </div>
                    <div className="rounded-md py-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Duration
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {test.duration} minutes
                      </p>
                    </div>
                    <div className="rounded-md py-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Questions
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {test.questionCount}
                      </p>
                    </div>
                    <div className="rounded-md py-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Maximum Marks
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {test.totalMarks}
                      </p>
                    </div>
                  </section>
                </section>

                <section className="space-y-3 bg-card px-4  py-2 rounded-lg border">
                  {/* <h4 className="text-sm font-semibold text-foreground">
                    Section-wise Distribution
                  </h4> */}
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">
                            Questions
                          </TableHead>
                          <TableHead className="text-right">Marks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Physics</TableCell>
                          <TableCell className="text-center">25</TableCell>
                          <TableCell className="text-right">100</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Chemistry</TableCell>
                          <TableCell className="text-center">25</TableCell>
                          <TableCell className="text-right">100</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mathematics</TableCell>
                          <TableCell className="text-center">25</TableCell>
                          <TableCell className="text-right">100</TableCell>
                        </TableRow>
                        <TableRow className="font-medium">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-center">75</TableCell>
                          <TableCell className="text-right">300</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </section>

                <section className="space-y-3 rounded-lg border bg-card p-4">
                  <h4 className="text-sm font-semibold text-foreground">
                    Important Instructions
                  </h4>
                  <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    <li>
                      Each section contains MCQ and numerical questions. Attempt
                      all questions carefully.
                    </li>
                    <li>
                      Your responses are auto-saved periodically and at the end
                      of the exam.
                    </li>
                    <li>
                      Every MCQ has one correct option. Select the best answer
                      from four choices.
                    </li>
                    <li>
                      Marking scheme: +{positiveMark} for correct answers
                      {test.negativeMarking
                        ? `, -${negativeMark} for incorrect answers`
                        : ""}
                      .
                    </li>
                    <li>
                      You can change your selected option any time before final
                      submission.
                    </li>
                    <li>
                      You can navigate to any question using the question
                      palette.
                    </li>
                    <li>
                      Do not click submit before completion. Once submitted, the
                      test cannot be resumed.
                    </li>
                    <li>
                      The backend timer is final. If time expires, the test will
                      be auto-submitted.
                    </li>
                  </ol>
                </section>
              </div>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-end border-t bg-background px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">
              <ChevronLeftIcon />
              Back
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JEEInstructions;
