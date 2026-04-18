"use client";

import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Grid,
  X,
} from "lucide-react";
import { ModeToggle } from "@/components/dark mode/toggle-theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import SmartText from "@/components/SmartText";
import { useTest } from "@/context/TestContext";

const legendItems = [
  { label: "Not Visited", color: "bg-slate-500" },
  { label: "Unanswered", color: "bg-amber-400" },
  { label: "Answered", color: "bg-blue-600" },
  { label: "Review", color: "bg-cyan-500" },
  { label: "Review with Answer", color: "bg-emerald-500" },
];

function formatTimer(seconds: number) {
  const safeSeconds = Math.max(seconds, 0);
  const totalMinutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${totalMinutes}:${remainingSeconds.toString().padStart(2, "0")} MIN`;
}

function getQuestionStateClass(
  status: "not_visited" | "unanswered" | "answered" | "review" | "review_with_answer",
  isCurrent: boolean
) {
  const base = isCurrent ? "ring-2 ring-ring ring-offset-2" : "";

  switch (status) {
    case "review_with_answer":
      return `${base} bg-emerald-500 hover:bg-emerald-500 text-white`;
    case "review":
      return `${base} bg-cyan-500 hover:bg-cyan-500 text-white`;
    case "answered":
      return `${base} bg-blue-600 hover:bg-blue-500 text-white`;
    case "unanswered":
      return `${base} bg-amber-400 hover:bg-amber-500 text-white`;
    default:
      return `${base} bg-slate-700 hover:bg-slate-500 text-white`;
  }
}

const QuestionNavigator = ({
  showThemeToggle,
}: {
  showThemeToggle?: boolean;
}) => {
  const { questions, currentQuestionIndex, goToQuestion, getQuestionState } = useTest();

  return (
    <Card className="rounded-2xl border bg-card shadow-sm">
      <CardHeader className="space-y-2 pb-3">
        <div className="relative flex items-center gap-3">
          <Avatar className="h-14 w-14 ring-2 ring-foreground">
            <AvatarImage
              src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&q=80"
              alt="Student"
            />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="gradient-text text-lg font-bold lg:text-3xl">
              Accurate Exams
            </CardTitle>
            <p className="mt-0.5 text-sm text-foreground md:text-lg">Galaxy Tab</p>
          </div>
          {showThemeToggle ? (
            <div className="absolute right-0 top-0">
              <ModeToggle />
            </div>
          ) : null}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm lg:grid-cols-3">
          {legendItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 text-foreground ${index === 4 ? "w-fit text-nowrap" : ""}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <Separator />
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {questions.map((question, index) => {
            const status = getQuestionState(question.id);
            const isCurrent = index === currentQuestionIndex;

            return (
              <Button
                key={question.id}
                variant="ghost"
                size="icon"
                onClick={() => goToQuestion(index)}
                className={`h-11 w-11 cursor-pointer rounded-full p-0 text-base font-semibold ${getQuestionStateClass(status, isCurrent)}`}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const SheetSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-md text-sm lg:hidden"
        >
          <Grid />
          View Grid
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] lg:hidden">
        <SheetHeader>
          <SheetTitle>Question Navigation</SheetTitle>
          <SheetDescription>
            Jump to any question from the grid.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-2">
          <QuestionNavigator showThemeToggle />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const LeftPanel = () => {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    marksPerQuestion,
    negativeMarking,
    negativeMarkValue,
    remainingSeconds,
    currentQuestionState,
    selectOption,
  } = useTest();

  if (!currentQuestion) {
    return (
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="py-10 text-center text-muted-foreground">
          No questions available for this test.
        </CardContent>
      </Card>
    );
  }

  const selectedValue =
    currentQuestionState.selectedOption !== null
      ? String(currentQuestionState.selectedOption)
      : "";

  const hasImage = Boolean(currentQuestion.imageURL?.trim());

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border py-4 shadow-sm">
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500">
            <AlarmClock className="h-5 w-5" />
            <p className="text-sm">: {formatTimer(remainingSeconds)}</p>
          </div>
          <div className="flex space-x-2 lg:space-x-0">
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer bg-primary text-sm text-white hover:bg-primary/90 dark:text-foreground"
            >
              Submit
            </Button>
            <div className="lg:hidden">
              <Separator className="h-4" orientation="vertical" />
            </div>
            <SheetSidebar />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-xl">
            <p className="text-base font-medium">
              Question <span className="font-bold">{currentQuestionIndex + 1}/{totalQuestions}</span>
            </p>
            <Badge
              variant="outline"
              className="rounded-lg px-2.5 py-1 text-sm font-semibold"
            >
              {marksPerQuestion} / {negativeMarking ? `-${negativeMarkValue}` : "0"}
            </Badge>
          </div>
          <Separator />

          <div className="text-xl font-medium leading-snug text-foreground">
            <SmartText text={currentQuestion.question} />
          </div>

          {hasImage ? (
            <img
              src={currentQuestion.imageURL!}
              alt={`Question ${currentQuestionIndex + 1}`}
              className="h-52 w-full rounded-lg border object-contain"
            />
          ) : (
            <div className="flex h-52 items-center justify-center rounded-lg border bg-slate-900 text-sm text-muted-foreground">
              Question Image Placeholder
            </div>
          )}

          <RadioGroup
            value={selectedValue}
            onValueChange={(value) => selectOption(Number(value))}
            className="w-full gap-4"
          >
            {currentQuestion.options.map((option, index) => {
              const optionId = `q-${currentQuestion.id}-option-${index}`;
              const optionLabel = String.fromCharCode(65 + index);

              return (
                <div
                  key={optionId}
                  className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/10 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative w-full rounded-md border px-4 py-5 shadow-xs outline-none transition-[color,box-shadow] has-focus-visible:ring-[3px]"
                >
                  <RadioGroupItem
                    value={String(index)}
                    id={optionId}
                    className="sr-only"
                    aria-label={`Option ${optionLabel}`}
                  />

                  <Label
                    htmlFor={optionId}
                    className="text-foreground after:absolute after:inset-0 flex cursor-pointer flex-col items-start"
                  >
                    <div className="flex w-full items-center gap-2">
                      <Badge variant="outline">{optionLabel}</Badge>
                      <SmartText text={option} className="leading-relaxed" />
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

const StickyFooter = () => {
  const {
    isFirstQuestion,
    isLastQuestion,
    currentQuestionState,
    goToNextQuestion,
    goToPreviousQuestion,
    markCurrentForReview,
    clearCurrentSelection,
  } = useTest();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 overflow-x-auto border-t bg-background/95 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-4 px-3 py-3 md:px-6 lg:max-w-[67vw]">
        <Button
          variant="secondary"
          disabled={isFirstQuestion}
          onClick={goToPreviousQuestion}
          className="h-8 cursor-pointer rounded-md px-4 text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden md:block">Previous</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="link"
            onClick={markCurrentForReview}
            className="h-8 cursor-pointer rounded-md bg-primary px-6 text-white hover:bg-primary dark:text-foreground"
          >
            <CircleDot className="h-5 w-5" />
            <span className="text-xs">
              {currentQuestionState.markedForReview
                ? "Unmark Review"
                : "Mark for Review"}
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={clearCurrentSelection}
            disabled={currentQuestionState.selectedOption === null}
            className="h-8 cursor-pointer rounded-md px-6"
          >
            <X className="h-5 w-5" />
            <span className="text-xs">Clear</span>
          </Button>
        </div>

        <Button
          variant="secondary"
          disabled={isLastQuestion}
          onClick={goToNextQuestion}
          className="h-8 cursor-pointer rounded-md px-4 text-base"
        >
          <span className="hidden md:block">Next</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default function TestAttemptClient({ testTitle }: { testTitle: string }) {
  return (
    <main className="min-h-screen pb-28">
      <div className="px-3 py-6 md:px-6 md:py-8">
        <div className="flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-bold tracking-tight">{testTitle}</h1>
          <Button className="bg-linear-to-l from-transparent to-transparent cursor-pointer border border-transparent font-normal text-destructive underline underline-offset-4 hover:border hover:border-destructive">
            Quit Test
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <section className="lg:col-span-4">
            <LeftPanel />
          </section>

          <aside className="hidden lg:col-span-2 lg:block">
            <QuestionNavigator showThemeToggle />
          </aside>
        </div>
      </div>

      <StickyFooter />
    </main>
  );
}
