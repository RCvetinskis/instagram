import { Suspense } from "react";
import { UserPageSkeleton } from "./page";

const UserPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<UserPageSkeleton />}>{children}</Suspense>
    </div>
  );
};

export default UserPageLayout;
