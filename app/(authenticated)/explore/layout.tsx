import { Suspense } from "react";
import {
  DesktopRightSidebar,
  DesktopRightSidebarSkeleton,
} from "../_components/navigation/foryou/desktop-sidebar-right";
import { PostsSkeleton } from "../_components/posts/posts";
const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full pt-5">
      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto md:container ">
        <Suspense fallback={<PostsSkeleton />}>{children}</Suspense>
      </div>
      {/* Right Sidebar*/}
      <div className="hidden lg:block lg:w-1/3 ">
        <Suspense fallback={<DesktopRightSidebarSkeleton />}>
          <DesktopRightSidebar />
        </Suspense>
      </div>
    </div>
  );
};

export default ExploreLayout;
