import { HoverLabel } from "@/components/hover-label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DesktopItemProps {
  href?: string;
  label: string;
  icon: any;
  active?: boolean;
  side?: "top" | "bottom" | "left" | "right";
}

export const NavItem = ({
  href,
  label,
  icon: Icon,
  active,
  side,
}: DesktopItemProps) => {
  return (
    <HoverLabel asChild label={label} side={side}>
      {href ? (
        <Link
          href={href}
          className={cn(
            " hover:text-gray-500  transition p-1",
            active && "text-gray-500 border-b-2"
          )}
        >
          <Icon className="h-6 w-6 shrink-0" />
        </Link>
      ) : (
        <div className="cursor-pointer hover:text-gray-500 p-1">
          <Icon className="h-6 w-6 shrink-0" />
        </div>
      )}
    </HoverLabel>
  );
};

export const NavItemSkeleton = () => {
  return <Skeleton className="h-6 w-6  bg-gray-400 rounded-full"></Skeleton>;
};
