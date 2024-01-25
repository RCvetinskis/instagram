import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface UserAvatarProps {
  avatar: any;
  className?: string;
}

export const UserAvatar = ({ avatar, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      <AvatarImage src={avatar ? avatar : "./insta_user_avatar.png"} />
      <AvatarFallback>User</AvatarFallback>
    </Avatar>
  );
};

export const UserAvatarSkeleton = () => {
  return (
    <div className="w-8 h-8  shrink-0 flex relative">
      <Skeleton className="w-full h-wull aspect-square rounded-full bg-gray-500"></Skeleton>
    </div>
  );
};
