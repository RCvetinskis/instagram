"use client";
import { useEffect, useState } from "react";
import useRoutes from "@/hooks/useRoutes";
import { NavItem, NavItemSkeleton } from "./nav-item";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

export const MobileFooter = () => {
  const [isMounted, setIsMounted] = useState(false);
  const routes = useRoutes();
  const { theme } = useTheme();
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !user) {
    return (
      <footer className="fixed justify-between w-full bottom-0 z-40 flex items-center p-1 md:hidden bg-[#121212]  ">
        {[...Array(7)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </footer>
    );
  }
  const backgroundColor = theme === "light" ? "bg-white" : "bg-[#121212]";
  return (
    <footer
      className={cn(
        "fixed justify-between w-full bottom-0 z-40 flex items-center p-1 md:hidden",
        backgroundColor
      )}
    >
      {routes.map((item) => (
        <NavItem
          key={item.label}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={item.active}
          side="top"
        />
      ))}
    </footer>
  );
};
