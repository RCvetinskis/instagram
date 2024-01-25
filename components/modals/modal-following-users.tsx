"use client";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { UserFollowersProps } from "@/types";
import { UserLabel } from "../user/user-label";
import { onUnfollowUser } from "@/actions/follow-actions";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ModalFollowingUsersProps {
  followingUsers: UserFollowersProps[];
  children: React.ReactNode;
}

export const ModalFollowingUsers = ({
  children,
  followingUsers,
}: ModalFollowingUsersProps) => {
  const [followingPeople, setFollowinigPeople] = useState(followingUsers);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();

  const handleUnfollow = (userId: string) => {
    startTransition(() => {
      onUnfollowUser(userId).then((res) => {
        toast.success(`You unfollowed ${res.following?.username}`);
        setFollowinigPeople((prev) =>
          prev.filter((singleFollow) => singleFollow.id !== res.id)
        );
      });
    });
  };
  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent
        className={cn("border-none shadow-3xl", dialogContentStyle)}
      >
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 max-h-[50vh] h-full overflow-y-auto">
          {followingPeople.length === 0 && <p>User follows no one</p>}
          {followingPeople.map((follow) => (
            <div
              key={follow.followingId}
              className="flex justify-between items-center"
            >
              <UserLabel
                href={`/user/${follow.following.username}`}
                user={follow.following}
              />
              <Button
                disabled={isPending}
                onClick={() => handleUnfollow(follow.followingId)}
              >
                Unfollow
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
