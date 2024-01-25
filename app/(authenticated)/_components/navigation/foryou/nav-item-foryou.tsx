import { UserLabel, UserLabelSkeleton } from "@/components/user/user-label";
import { User } from "@prisma/client";

interface NavItemForYouProps {
  href: string;
  user: User;
}

export const NavItemForyou = async ({ href, user }: NavItemForYouProps) => {
  return (
    <li className="p-3 w-full hover:shadow-2xl rounded ">
      <UserLabel user={user} href={href} side="bottom" align="center" />
    </li>
  );
};

export const NavItemForYouSkeleton = () => {
  return (
    <li className="flex items-center justify-between  p-3 w-full hover:shadow-2xl rounded ">
      <UserLabelSkeleton />
    </li>
  );
};
