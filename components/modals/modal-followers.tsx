"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { UserFollowingProps } from "@/types";
import { UserLabel } from "../user/user-label";

interface ModalFollowersProps {
  followers: UserFollowingProps[];
  children: React.ReactNode;
}

export const ModalFollowers = ({
  children,
  followers,
}: ModalFollowersProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent
        className={cn("border-none rounded shadow-3xl", dialogContentStyle)}
      >
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        {followers.length === 0 && <p>User has no followers</p>}
        {followers.map((follow) => (
          <UserLabel
            key={follow.followerId}
            href={`/user/${follow.follower.username}`}
            user={follow.follower}
            align="center"
          />
        ))}
      </DialogContent>
    </Dialog>
  );
};
