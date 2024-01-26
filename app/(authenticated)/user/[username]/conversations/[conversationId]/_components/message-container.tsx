"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";
import { SenderExtentedMessages } from "@/types";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";

interface MessageContainerProps {
  message: SenderExtentedMessages;
}

export const MessageContainer = ({ message }: MessageContainerProps) => {
  const { user: currentUser } = useUser();

  const isOwn = currentUser?.username === message.sender.username;

  const container = cn("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = cn(isOwn && "order-2");
  const info = cn("flex flex-col gap-2", isOwn && "items-end");
  const messageClass = cn(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-700 text-white" : "bg-neutral-800 text-white",
    message.file ? "rounded p-0" : "rounded-full py-2 px-3"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <UserAvatar initialUser={message.sender} />
      </div>
      <div className={info}>
        <div className="flex items-center  gap-1">
          <div className="text-sm text-gray-500">{message.sender.username}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>

        <div className={messageClass}>
          {message.file && (
            <Image
              alt="Image"
              height={288}
              width={288}
              src={message.file}
              className="object-cover "
            />
          )}
          {message.message && <div>{message.message}</div>}
        </div>
      </div>
    </div>
  );
};

export const MessageContainerSkeleton = () => {
  return (
    <div className="flex gap-3 p-4">
      <div>
        <UserAvatarSkeleton />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-center  gap-1">
          <Skeleton className="bg-gray-500 w-[44px] h-[20px] rounded" />
          <Skeleton className="bg-gray-500 w-[40px] h-[10px] rounded" />
        </div>
      </div>
    </div>
  );
};
