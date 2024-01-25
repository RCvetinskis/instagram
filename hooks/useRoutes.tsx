"use client";
import { usePathname } from "next/navigation";
import { Home, Compass, Send } from "lucide-react";
import { NavUserItem } from "@/components/user/nav-user-item";
import { ThemeToggle } from "@/components/toggle-theme";
import { CreatePostModal } from "@/components/modals/modal-create-post";
import { ModalSearch } from "@/components/modals/modal-search";
import { useUser } from "@clerk/nextjs";
const useRoutes = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      icon: Home,
    },
    {
      label: "Seach",
      icon: ModalSearch,
    },
    {
      href: "/explore",
      active: pathname === "/explore",
      label: "Explore",
      icon: Compass,
    },
    {
      href: `/user/${user?.username}/conversations`,
      active: pathname === `/user/${user?.username}/conversations`,
      label: "Conversations",
      icon: Send,
    },
    {
      label: "Create Post",
      icon: CreatePostModal,
    },

    {
      href: `/user/${user?.username}`,
      active: pathname === `/user/${user?.username}`,
      label: "Profile",
      icon: NavUserItem,
    },
    {
      label: "Theme",
      icon: ThemeToggle,
    },
  ];

  return routes;
};

export default useRoutes;
