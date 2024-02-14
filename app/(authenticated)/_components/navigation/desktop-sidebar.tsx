"use client";
import { useState, useEffect } from "react";
import useRoutes from "@/hooks/useRoutes";

import { NavItem, NavItemSkeleton } from "./nav-item";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export const DesktopSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const routes = useRoutes();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !user || !isLoaded) {
    return (
      <aside className="h-full py-8 md:px-2 lg:px-0 shadow-3xl shadow-black">
        <ul className="flex flex-col items-center justify-between h-full">
          <Skeleton className="text-3xl font-serif my-6 hidden lg:block">
            Instagram
          </Skeleton>

          {[...Array(7)].map((_, i) => (
            <NavItemSkeleton key={i} />
          ))}
        </ul>
      </aside>
    );
  }

  return (
    <aside className="h-full py-8 md:px-2 lg:px-0 shadow-3xl shadow-black">
      <ul
        role="list"
        className="flex flex-col items-center justify-between h-full"
      >
        <Link href={"/"} className="hidden lg:block">
          <h1 className="text-3xl  font-serif my-6 hover:text-gray-500 transition">
            Instagram
          </h1>
        </Link>

        {routes.map((item) => (
          <NavItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.active}
            side="right"
          />
        ))}
      </ul>
    </aside>
  );
};
