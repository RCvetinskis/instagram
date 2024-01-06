"use client";
import { HoverLabel } from "@/components/hover-label";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DesktopItemProps {
  href: string;
  label: string;
  icon: any;
  onClick?: () => void;
  active?: boolean;
  side?: "top" | "bottom" | "left" | "right";
}

export const NavItem = ({
  href,
  label,
  icon: Icon,
  onClick,
  active,
  side,
}: DesktopItemProps) => {
  const handleClick = () => {
    if (onClick) return onClick();
  };
  return (
    <HoverLabel asChild label={label} side={side}>
      <li onClick={handleClick}>
        <Link
          href={href}
          className={cn(
            " text-gray-400  hover:text-gray-300 transition",
            active && "text-inherit "
          )}
        >
          <Icon className="h-6 w-6 shrink-0" />
        </Link>
      </li>
    </HoverLabel>
  );
};
