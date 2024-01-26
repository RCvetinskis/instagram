"use client";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const NavUserItem = () => {
  const { user } = useUser();
  return (
    <Avatar className={"h-8 w-8"}>
      <AvatarImage
        src={user?.imageUrl ? user?.imageUrl : "./insta_user_avatar.png"}
      />
      <AvatarFallback>User</AvatarFallback>
    </Avatar>
  );
};
