"use client";

import {
  AlarmClock,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  Grid,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/dark mode/toggle-theme";
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

const options = [
  {
    id: "a",
    label: "A",
    value: "$\\frac{\\mu_0 I}{\\pi R}$",
  },
  {
    id: "b",
    label: "B",
    value: "$\\frac{\\mu_0 I}{2\\pi R}$",
  },
  {
    id: "c",
    label: "C",
    value: "$\\frac{\\mu_0 I}{4\\pi R}$",
  },
  {
    id: "d",
    label: "D",
    value: "None of the above",
  },
];

const legendItems = [
  { label: "Not Visited", color: "bg-slate-500" },
  { label: "Unanswered", color: "bg-amber-400" },
  { label: "Answered", color: "bg-blue-600" },
  { label: "Review", color: "bg-cyan-500" },
  { label: "Review with Answer", color: "bg-emerald-500" },
];

const questionNumbers = Array.from({ length: 25 }, (_, index) => index + 1);

const getQuestionStateClass = (number: number) => {
  const isCurrent = number === 1;
  const isAnswered = [2, 4, 9, 13, 18, 24].includes(number);
  const isReview = [6, 11, 17].includes(number);
  const isReviewWithAnswer = [8, 15].includes(number);

  if (isCurrent) return "bg-amber-400 hover:bg-amber-500";
  if (isReviewWithAnswer) return "bg-emerald-500 hover:bg-emerald-500";
  if (isReview) return "bg-cyan-500 hover:bg-cyan-500";
  if (isAnswered) return "bg-blue-600 hover:bg-blue-500";
  return "bg-slate-700 hover:bg-slate-500";
};

const QuestionNavigator = ({
  showThemeToggle,
}: {
  showThemeToggle?: boolean;
}) => {
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
            <CardTitle className="gradient-text text-lg lg:text-3xl font-bold">
              Accurate Exams
            </CardTitle>
            <p className="mt-0.5 text-sm md:text-lg text-foreground">Galaxy Tab</p>
          </div>
          {showThemeToggle ? (
            <div className="absolute right-0 top-0">
              <ModeToggle />
            </div>
          ) : null}
        </div>

        <Separator />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          {legendItems.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 text-foreground ${i === 4 && "text-nowrap w-fit"}`}
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
          {questionNumbers.map((number) => (
            <Button
              key={number}
              variant="ghost"
              size={"icon"}
              className={`h-11 w-11 rounded-full p-0 text-base font-semibold text-white cursor-pointer ${getQuestionStateClass(number)}`}
            >
              {number}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const LeftPanel = () => {
  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border shadow-sm py-4">
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center text-red-500 gap-2">
            <AlarmClock className="h-5 w-5 " />
            <p className="text-sm ">: 1 hr 15 mins</p>
          </div>
            <div className="flex space-x-2 lg:space-x-0">
            <Button
              size={"sm"}
              variant={"secondary"}
              className="text-sm bg-primary hover:bg-primary text-white dark:text-foreground"
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
      <Card className="rounded-2xl border shadow-sm ">
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-xl">
            <p className="text-base font-medium ">
              Question <span className="font-bold ">1/25</span>
            </p>
            <Badge
              variant="outline"
              className="rounded-lg px-2.5 py-1 text-sm font-semibold"
            >
              4 / -1
            </Badge>
          </div>
          <Separator />

          <p className="text-xl text-foreground font-medium leading-snug ">
            A long infinite current-carrying wire is bent in the shape as shown
            in the figure. The magnetic induction at point O is:
          </p>

          <div className="flex h-52 items-center justify-center rounded-lg border bg-slate-900  text-sm text-muted-foreground">
            Question Image Placeholder
          </div>

          <RadioGroup className="w-full gap-4">
            {options.map((option) => (
              <div
                key={option.id}
                className="border-input has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative w-full rounded-md border py-5 px-4 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${option.id}-1`}
                  className="sr-only"
                  aria-label="plan-radio-basic"
                  aria-describedby={`${option.id}-1-description`}
                />

                <Label
                  htmlFor={`${option.id}-1`}
                  className="text-foreground flex flex-col items-start cursor-pointer after:absolute after:inset-0"
                >
                  <div className="flex w-full items-center gap-2  ">
                    <Badge variant={"outline"}>{option.label}</Badge>
                    <span>{option.value}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

const RightSidebar = () => {
  return <QuestionNavigator showThemeToggle />;
};

const SheetSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"sm"}
          variant={"outline"}
          className="text-sm rounded-md lg:hidden"
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
          <QuestionNavigator showThemeToggle/>
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

const StickyFooter = () => {
  return (
    <div className="fixed overflow-x-auto inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur">
      <div className="flex w-full  lg:max-w-[67vw] items-center justify-between gap-4 px-3 py-3 md:px-6">
        <Button
          variant="secondary"
          className="h-8 cursor-pointer rounded-md px-4 text-base"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden md:block">Previous</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant={"link"}
            className="h-8 cursor-pointer rounded-md bg-primary hover:bg-primary px-6 text-white dark:text-foreground"
          >
            <CircleDot className="h-5 w-5" />
            <span className="text-xs">Mark for Review</span>
          </Button>
          <Button
            variant="outline"
            className="h-8 cursor-pointer rounded-md px-6"
          >
            <X className="h-5 w-5" />
            <span className="text-xs">Clear</span>
          </Button>
        </div>

        <Button
          variant="secondary"
          className="h-8 cursor-pointer rounded-md px-4 text-base"
        >
          <span className="hidden md:block">Next</span>

          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function TempPage() {
  return (
    <main className="min-h-screen pb-28">
      <div className="px-3 py-6 md:px-6 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">
          Mock Test - 1
        </h1>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <section className="lg:col-span-4">
            <LeftPanel />
          </section>

          <aside className="hidden lg:col-span-2 lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>

      <StickyFooter />
    </main>
  );
}
