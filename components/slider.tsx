"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface SliderProps {
  files: string[];
  prevArrow?: string;
  nextArrow?: string;
}

export function Slider({ files, prevArrow, nextArrow }: SliderProps) {
  const isMdScreen = useMediaQuery("(max-width: 768px)");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className="w-full">
      {files && (
        <CarouselContent>
          {files.map((file) => {
            const isVideo = file.includes("mp4");
            const isImage = file.includes("png") || file.includes("jpg");

            return (
              <CarouselItem key={file}>
                <Card className="border-none">
                  <CardContent className="flex aspect-square items-center justify-center  relative">
                    {isVideo ? (
                      <div className="bg-black rounded w-full h-full ">
                        <video
                          src={file}
                          controls
                          className="w-full h-full rounded"
                        />
                      </div>
                    ) : isImage ? (
                      <div className="w-full h-full relative">
                        <Image
                          alt="Post Image"
                          fill
                          className="rounded"
                          loading="lazy"
                          src={file}
                        />
                      </div>
                    ) : (
                      <div>Unsupported file format</div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      )}

      {files.length > 1 && !isMdScreen && (
        <>
          <CarouselPrevious className={cn(prevArrow)} />
          <CarouselNext className={cn(nextArrow)} />
          <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
            <span>Content {current}</span>
            <span>Of {count}</span>
          </div>
        </>
      )}
      {isMdScreen && files.length > 1 && (
        <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
          <span>Content {current}</span>
          <span>Of {count}</span>
        </div>
      )}
    </Carousel>
  );
}

export const SliderSkeleton = () => {
  return (
    <div className="w-[300px]  sm:w-[400px] md:w-[550px]    xl:w-[700px]  relative ">
      <div className="flex aspect-square items-center justify-center  relative">
        <Skeleton className="w-full h-full bg-gray-500" />
      </div>
    </div>
  );
};
