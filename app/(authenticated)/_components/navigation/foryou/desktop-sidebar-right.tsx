import { NavItemForYouSkeleton, NavItemForyou } from "./nav-item-foryou";
import { getCurrentUser, getSuggestedUsers } from "@/lib/user-service";
import {
  UserCurrentLabel,
  UserCurrentLabelSkeleton,
} from "@/components/user/user-current-label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
export const DesktopRightSidebar = async () => {
  const suggestedUsers = await getSuggestedUsers();
  const currentUser = await getCurrentUser();

  const routes = suggestedUsers?.map((user) => ({
    href: `/user/${user.username}`,
    user,
  }));

  if (!routes || !currentUser) {
    return null;
  }

  return (
    <aside className="h-full  py-2">
      <ul
        role="list"
        className="flex flex-col items-start justify-start h-full p-3"
      >
        <UserCurrentLabel />
        <div className="flex items-center justify-around w-full">
          <h2 className="text-gray-500">Suggested for you</h2>
          <Button variant={"link"}>See All</Button>
        </div>
        <Separator className="my-1" />
        <div className="overflow-y-auto w-full h-full">
          {routes.length === 0 && <p>No new users</p>}
          {routes.map((item) => (
            <NavItemForyou
              key={item.user.id}
              href={item.href}
              user={item.user}
            />
          ))}
        </div>
      </ul>
    </aside>
  );
};

export const DesktopRightSidebarSkeleton = () => {
  return (
    <aside className="h-full py-8">
      <ul className="flex flex-col items-start justify-start h-full p-3">
        <UserCurrentLabelSkeleton />
        <Skeleton>
          <h2>Suggested for you</h2>
          <Button variant={"link"}>See All</Button>
        </Skeleton>
        <Separator className="my-4" />
        {[...Array(5)].map((_, i) => (
          <NavItemForYouSkeleton key={i} />
        ))}
      </ul>
    </aside>
  );
};
