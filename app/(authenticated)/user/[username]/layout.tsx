import { Suspense } from "react";
import { UserPageSkeleton } from "./_components/user-page-skeleton";

const UserPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<UserPageSkeleton />}>{children}</Suspense>
    </div>
  );
};

export default UserPageLayout;
