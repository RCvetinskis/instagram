"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { User } from "@prisma/client";

interface UserAvatarProps {
  user: User;
  className?: string;
}

export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  return (
    <div className="relative">
      <Avatar className={cn("h-8 w-8", className)}>
        <AvatarImage
          src={user.avatar ? user.avatar : "./insta_user_avatar.png"}
        />
        <AvatarFallback>User</AvatarFallback>
      </Avatar>

      <Badge variant={user.online ? "online" : "offline"} />
    </div>
  );
};

export const UserAvatarSkeleton = () => {
  return (
    <div className="w-8 h-8  shrink-0 flex relative">
      <Skeleton className="w-full h-wull aspect-square rounded-full bg-gray-500"></Skeleton>
    </div>
  );
};
