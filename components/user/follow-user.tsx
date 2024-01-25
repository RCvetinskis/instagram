"use client";
import { onFollowUser, onUnfollowUser } from "@/actions/follow-actions";
import { Button } from "@/components/ui/button";

import { useTransition } from "react";
import { toast } from "sonner";

interface FollowActionprops {
  userId: string;
  isUserFollowing: boolean;
}
export const FollowUser = ({ userId, isUserFollowing }: FollowActionprops) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollowUser(userId)
        .then((res) => {
          toast.success(`You are following ${res.following.username}`);
        })
        .catch((error) => toast.error(error.message));
    });
  };

  const handleUnFollow = () => {
    startTransition(() => {
      onUnfollowUser(userId)
        .then((res) => {
          toast.success(`You Unfollowed ${res.following.username}`);
        })
        .catch((error) => toast.error(error.message));
    });
  };

  return (
    <>
      {isUserFollowing ? (
        <Button
          disabled={isPending}
          onClick={handleUnFollow}
          variant={"shadow"}
        >
          Unfollow
        </Button>
      ) : (
        <Button disabled={isPending} onClick={handleFollow} variant={"primary"}>
          Follow
        </Button>
      )}
    </>
  );
};
