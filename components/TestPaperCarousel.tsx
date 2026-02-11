"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Calendar,
  ShoppingCart,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatDurationFromMonths } from "@/lib/utils";
import Image from "next/image";

// Types for featured batches
interface FeaturedBatch {
  _id: string;
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  expiry: number | null;
  contentType: "test" | "file";
  totalCount: number;
  description: string | null;
  exam: {
    _id: string;
    id: string;
    title: string;
    slug: string;
    imageURL: string | null;
  };
}

interface TestPaperCarouselProps {
  featuredBatches?: FeaturedBatch[];
}

const TestPaperCarousel = ({
  featuredBatches = [],
}: TestPaperCarouselProps) => {
  // Fallback mock data when no featured batches are available
  const mockTests = [
    {
      id: "mock-1",
      title: "MHT CET PYP 2025",
      examTitle: "MHT CET",
      examSlug: "mht-cet",
      slug: "pyp-2025",
      attempts: 164,
      price: 299,
      originalPrice: 599,
      expiry: null,
      totalCount: 150,
      contentType: "test" as const,
      examImageURL: null,
    },
    {
      id: "mock-2",
      title: "NTA CUET General Tests 2026",
      examTitle: "CUET",
      examSlug: "cuet",
      slug: "general-2026",
      attempts: 85,
      price: 199,
      originalPrice: 399,
      expiry: null,
      totalCount: 50,
      contentType: "test" as const,
      examImageURL: null,
    },
    {
      id: "mock-3",
      title: "WBJEE Physics PYP",
      examTitle: "WBJEE",
      examSlug: "wbjee",
      slug: "physics-pyp",
      attempts: 79,
      price: 149,
      originalPrice: 299,
      expiry: null,
      totalCount: 17,
      contentType: "test" as const,
      examImageURL: null,
    },
    {
      id: "mock-4",
      title: "WBJEE Chemistry PYP",
      examTitle: "WBJEE",
      examSlug: "wbjee",
      slug: "chemistry-pyp",
      attempts: 211,
      price: 149,
      originalPrice: 299,
      expiry: null,
      totalCount: 18,
      contentType: "test" as const,
      examImageURL: null,
    },
  ];

  // Use featured batches if available, otherwise use mock data
  const displayItems =
    featuredBatches.length > 0
      ? featuredBatches.map((batch) => ({
          id: batch._id || batch.id,
          title: batch.title,
          examTitle: batch.exam.title,
          examSlug: batch.exam.slug,
          examImageURL: batch.exam.imageURL,
          slug: batch.slug,
          attempts: 225, // Hardcoded random attempts for now
          price: batch.price,
          originalPrice: batch.originalPrice,
          expiry: batch.expiry,
          totalCount: batch.totalCount,
          contentType: batch.contentType,
        }))
      : mockTests;

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

  const maxIndex = Math.max(0, displayItems.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused || displayItems.length <= visibleCards) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, displayItems.length, visibleCards]);

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

  // Calculate discount percentage
  const getDiscount = (price: number, originalPrice: number) => {
    if (originalPrice <= 0 || price >= originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const cardWidth = 100 / visibleCards;

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No featured practice sets available at the moment.</p>
      </div>
    );
  }

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
          {displayItems.map((item) => {
            const discount = getDiscount(item.price, item.originalPrice);

            return (
              <div
                key={item.id}
                className="shrink-0 px-2"
                style={{ width: `${cardWidth}%` }}
              >
                <Card className="relative bg-card hover:shadow-xl transition-shadow h-full flex flex-col">
                  {discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1">
                      {discount}% OFF
                    </Badge>
                  )}

                  <CardHeader className="space-y-4">
                    {/* <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary-foreground fill-current" />
                    </div> */}

                    <div className="flex gap-2 items-center">
                      <Image
                        src={item.examImageURL || "/default-exam.png"}
                        alt={item.examTitle}
                        width={40}
                        height={40}
                      />
                      <div className="">
                        <h4 className="font-bold text-lg leading-tight text-foreground line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.examTitle}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium w-fit"
                    >
                      {item.attempts} Attempts
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          {item.totalCount}{" "}
                          {item.contentType === "test" ? "Tests" : "Files"}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span>
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-foreground flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {item.price}
                          </span>
                          {discount > 0 && (
                            <span className="text-muted-foreground line-through flex items-center text-xs">
                              <IndianRupee className="h-2.5 w-2.5" />
                              {item.originalPrice}
                            </span>
                          )}
                        </span>
                      </li>
                      {item.expiry !== null && (
                        <li className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Validity: {formatDurationFromMonths(item.expiry)}
                          </span>
                        </li>
                      )}
                    </ul>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <Link
                        href={`/exam/${item.examSlug}/${item.slug}`}
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      {displayItems.length > visibleCards && (
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
      )}
    </div>
  );
};

export default TestPaperCarousel;