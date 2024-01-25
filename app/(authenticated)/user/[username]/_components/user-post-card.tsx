"use client";
import { Skeleton } from "@/components/ui/skeleton";
import useCommentsLength from "@/hooks/useCommentsLength";
import { UserCommentsExtentedPost } from "@/types";
import { Files, MessageCircle } from "lucide-react";
import Image from "next/image";

interface UserPostCardProps {
  post: UserCommentsExtentedPost;
}
export const UserPostCard = ({ post }: UserPostCardProps) => {
  const isImage =
    post.files[0].includes("jpg") || post.files[0].includes("png");
  const isVideo = post.files[0].includes("mp4");

  const isMultiple = post.files.length > 1;

  const commentsLength = useCommentsLength(post.id, post.comments.length);

  return (
    <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]  group relative text-gray-500 cursor-pointer hover:opacity-90 hover:text-white  transition-all">
      {isMultiple && <Files className="absolute z-50 right-1 top-1" />}
      {isImage && (
        <>
          <Image
            alt="Post_Image"
            src={post.files[0]}
            loading="lazy"
            fill
            className="object-fit rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1">
              <MessageCircle fill="white" className=" text-3xl ml-4" />
              <span className="text-s">{commentsLength}</span>
            </div>
          </div>
        </>
      )}

      {isVideo && (
        <div className="bg-black rounded-xl w-full h-full relative">
          <video src={post.files[0]} className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1">
              <MessageCircle fill="white" className=" text-3xl ml-4" />
              <span className="text-s">{commentsLength}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const UserPostCardSkeleton = () => {
  return (
    <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]">
      <Skeleton className="w-full bg-gray-500" />
    </div>
  );
};
