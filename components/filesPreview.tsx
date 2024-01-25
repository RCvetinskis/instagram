import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { FilePreviewType } from "./modals/modal-create-post";

interface FilesPreviewProps {
  files: FilePreviewType[];
  onClear?: (fileToRemove: string) => void;
}

export function FilesPreview({ files, onClear }: FilesPreviewProps) {
  return (
    <Carousel className=" max-w-xs  relative">
      {onClear &&
        files.map((file) => (
          <Button
            key={file.previewUrl}
            variant={"ghost"}
            className="absolute top-0 right-0 z-[50] text-gray-300 cursor-pointer hover:text-gray-700"
            onClick={() => onClear(file.previewUrl)}
          >
            <Trash size={18} />
          </Button>
        ))}
      {files && (
        <CarouselContent>
          {files.map((file) => {
            const isVideo = file.file.type.includes("video");
            const isImage = file.file.type.includes("image");

            return (
              <CarouselItem key={file.previewUrl}>
                <div className="p-1">
                  <Card className="border-none">
                    <CardContent className="flex aspect-square items-center justify-center p-6 relative">
                      {isVideo ? (
                        <div className="bg-black rounded-xl w-full h-full ">
                          <video
                            src={file.previewUrl}
                            controls
                            className="w-full h-full"
                          />
                        </div>
                      ) : isImage ? (
                        <div className="w-full h-full relative">
                          <Image
                            alt="Post Image"
                            fill
                            className="rounded-xl"
                            src={file.previewUrl}
                          />
                        </div>
                      ) : (
                        <div>Unsupported file format</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      )}

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
