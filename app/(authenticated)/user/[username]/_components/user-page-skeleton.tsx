import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSkeleton } from "./header";
import { UserPostsSkeleton } from "./user-posts";

export const UserPageSkeleton = () => {
  return (
    <main>
      <HeaderSkeleton />
      <Skeleton className="my-5" />
      <UserPostsSkeleton />
    </main>
  );
};
