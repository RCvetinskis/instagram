import { getCurrentUser } from "@/lib/user-service";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "./user-avatar";

export const UserCurrentLabel = async () => {
  const currentUser = await getCurrentUser();

  return (
    <Link
      href={`/user/${currentUser?.username}`}
      className="flex  gap-x-3 p-3 hover:shadow-2xl rounded  "
    >
      <UserAvatar initialUser={currentUser!} />

      <div className="text-sm capitalize">
        <p>{currentUser?.username}</p>
        <p className="text-gray-500  truncate">{currentUser?.email}</p>
      </div>
    </Link>
  );
};

export const UserCurrentLabelSkeleton = () => {
  return (
    <div className="flex gap-x-3 p-3 hover:shadow-2xl rounded">
      <UserAvatarSkeleton />

      <Skeleton>
        <div className="text-xs capitalize">
          <p>Username</p>
          <p className="text-gray-500 ">Email</p>
        </div>
      </Skeleton>
    </div>
  );
};
