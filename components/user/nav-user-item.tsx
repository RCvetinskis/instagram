"use client";
import { useUser } from "@clerk/nextjs";
import { UserAvatar } from "./user-avatar";

export const NavUserItem = () => {
  const { user } = useUser();
  return <UserAvatar avatar={user?.imageUrl} />;
};
