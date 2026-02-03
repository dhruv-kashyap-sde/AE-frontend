"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Calculate visible cards based on screen width
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 768) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, mockTests.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;

      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    
    // Resume auto-slide after 3 seconds of no interaction
    setTimeout(() => setIsPaused(false), 3000);
  };

  const cardWidth = 100 / visibleCards;

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * cardWidth}%)`,
          }}
        >
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="shrink-0 px-2"
              style={{ width: `${cardWidth}%` }}
            >
              <Card className="relative bg-card hover:shadow-xl transition-shadow h-full">
                {test.isNew && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1">
                    NEW
                  </Badge>
                )}

                <CardHeader className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary-foreground fill-current" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-lg leading-tight text-foreground line-clamp-2">
                      {test.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
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
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center sm:justify-end gap-3 mt-6">
        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-6 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="h-10 w-10 rounded-full bg-background/90 hover:bg-background border-0 shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="h-10 w-10 rounded-full bg-background/90 hover:bg-background border-0 shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPaperCarousel;
