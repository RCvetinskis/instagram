import { User } from "@prisma/client";
import { HoverUser } from "./hover-user";
import { UserAvatar, UserAvatarSkeleton } from "./user-avatar";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
interface UserLabelProps {
  user: User;
  href: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}
export const UserLabel = ({ user, href, side, align }: UserLabelProps) => {
  return (
    <HoverUser asChild side={side} align={align} user={user}>
      <Link href={href}>
        <div className="flex gap-x-3 items-center cursor-pointer  hover:text-gray-400 ">
          <UserAvatar user={user} />

          <div className="text-sm capitalize">
            <p>{user.username}</p>
          </div>
        </div>
      </Link>
    </HoverUser>
  );
};

export const UserLabelSkeleton = () => {
  return (
    <div className="flex gap-x-3">
      <UserAvatarSkeleton />

      <Skeleton className="text-sm capitalize">
        <p>Username</p>
        <p className="text-gray-500 text-xs">
          Followed by
          <span className="ml-1 ">Username</span>
        </p>
      </Skeleton>
    </div>
  );
};
