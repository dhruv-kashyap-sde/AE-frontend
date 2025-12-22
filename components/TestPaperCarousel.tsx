"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay"
import React from "react";

const TestPaperCarousel = () => {
  const mockTests = [
    {
      id: 1,
      title: "MHT CET PYP 2025",
      subtitle: "MHT CET 2025 : 5th May Evening Shift",
      attempts: 164,
      questionsCount: 150,
      maxMarks: 200,
      time: 180,
      isNew: true,
    },
    {
      id: 2,
      title: "NTA CUET General Tests 2026",
      subtitle: "General Mock Test - 1",
      attempts: 85,
      questionsCount: 50,
      maxMarks: 250,
      time: 60,
      isNew: true,
    },
    {
      id: 3,
      title: "WBJEE - Physics Chapterwise PYP (2025-2008)",
      subtitle: "1. Units and Measurements",
      attempts: 79,
      questionsCount: 17,
      maxMarks: 34,
      time: 17,
      isNew: true,
    },
    {
      id: 4,
      title: "WBJEE - Chemistry Chapterwise PYP (2025-2008)",
      subtitle: "1. Some Basic Concepts of Chemistry",
      attempts: 211,
      questionsCount: 18,
      maxMarks: 36,
      time: 18,
      isNew: true,
    },
    {
      id: 5,
      title: "JEE Main 2025 Mock Test",
      subtitle: "Physics, Chemistry & Mathematics",
      attempts: 342,
      questionsCount: 90,
      maxMarks: 300,
      time: 180,
      isNew: false,
    },
    {
      id: 6,
      title: "NEET 2025 Full Length Test",
      subtitle: "Physics, Chemistry & Biology",
      attempts: 521,
      questionsCount: 180,
      maxMarks: 720,
      time: 180,
      isNew: false,
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <div className="relative">

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {mockTests.map((test) => (
            <CarouselItem key={test.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="relative bg-background hover:shadow-xl transition-shadow h-full">
                {test.isNew && (
                  <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1">
                    NEW
                  </Badge>
                )}
                
                <CardHeader className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary-foreground fill-current" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg leading-tight text-foreground ">
                      {test.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {test.subtitle}
                    </p>
                  </div>

                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium w-fit"
                  >
                    {test.attempts} Attempts
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Questions Count: {test.questionsCount}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Max Marks: {test.maxMarks}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Time: {test.time} minutes</span>
                    </li>
                  </ul>

                  <Link href={`/test/${test.id}`} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious  />
        <CarouselNext  />
      </Carousel>
    </div>
  );
};

export default TestPaperCarousel;
