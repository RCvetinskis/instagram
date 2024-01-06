"use client";
import useRoutes from "@/hooks/useRoutes";
import { NavItem } from "./nav-item";

export const MobileFooter = () => {
  const routes = useRoutes();
  return (
    <footer className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-black  p-1  md:hidden">
      {routes.map((item) => (
        <NavItem
          key={item.label}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={item.active}
          onClick={item.onClick}
          side="top"
        />
      ))}
    </footer>
  );
};
