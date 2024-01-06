"use client";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, Send, PlusSquare } from "lucide-react";
import { useMemo } from "react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/toggle-theme";
const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        href: "/",
        label: "Home",
        active: pathname === "/",
        icon: Home,
      },
      {
        href: "#",
        onClick: () => {},
        label: "Seach",
        icon: Search,
      },
      {
        href: "/explore",
        active: pathname === "/explore",
        label: "Explore",
        icon: Compass,
      },
      {
        href: "/messages",
        active: pathname === "/messages",
        label: "Messages",
        icon: Send,
      },
      {
        href: "#",
        onClick: () => {},
        label: "Create Post",
        icon: PlusSquare,
      },

      {
        href: "#",
        onClick: () => UserButton,
        label: "Settings",
        icon: UserButton,
      },
      {
        href: "#",
        onClick: () => ThemeToggle,
        label: "Theme",
        icon: ThemeToggle,
      },
    ],
    [pathname]
  );
  return routes;
};

export default useRoutes;
