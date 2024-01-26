"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Post, User } from "@prisma/client";
import { UserAvatar } from "./user-avatar";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserFirstPosts } from "@/actions/posts-actions";
import { getFollowsCount } from "@/lib/follow-service";

interface HoverUserProps {
  user: User;
  children?: React.ReactNode;
  asChild?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}
export const HoverUser = ({
  user,
  children,
  asChild,
  side,
  align,
}: HoverUserProps) => {
  const { theme } = useTheme();

  type UserPostsProps = {
    posts: Post[];
    totalPostsCount: number;
  };

  const defaultUserPosts: UserPostsProps = {
    posts: [],
    totalPostsCount: 0,
  };

  const [userPosts, setUserPosts] = useState<UserPostsProps>(defaultUserPosts);

  type followsProps = {
    followersCount: number;
    followingUsersCount: number;
  };
  const defaultFollows: followsProps = {
    followersCount: 0,
    followingUsersCount: 0,
  };

  const [follows, setFollows] = useState<followsProps>(defaultFollows);

  useEffect(() => {
    const userPosts = async () => {
      const posts = await getUserFirstPosts(user.id);
      setUserPosts(posts);
    };
    const userFollows = async () => {
      const followsCount = await getFollowsCount(user.id);
      setFollows(followsCount);
    };
    userPosts();
    userFollows();
  }, []);

  const toolTipStyle =
    theme === "light" ? "bg-white shadow-black" : " bg-black shadow-gray-700";
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>

        <TooltipContent
          className={cn("rounded-xl shadow-3xl border-none", toolTipStyle)}
          side={side}
          align={align}
        >
          <div className="py-5 px-1">
            <Link
              className="flex gap-x-3 hover:scale-95 transition-all "
              href={`/user/${user.username}`}
            >
              <UserAvatar user={user} />

              <div className="text-sm capitalize">
                <p>{user.username}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </div>
            </Link>
            <div className="flex items-center justify-between  gap-3 p-4">
              <div className="flex flex-col items-center  p-1">
                <span>{userPosts.totalPostsCount}</span>
                Posts
              </div>
              <div className="flex flex-col items-center  p-1">
                <span>{follows.followersCount}</span>
                Followers
              </div>
              <div className="flex flex-col items-center  p-1">
                <span>{follows.followingUsersCount}</span>
                Following
              </div>
            </div>
            <Separator className="border-b border-gray-500 my-3" />
            <div className="flex flex-wrap items-center justify-center gap-2 px-1">
              {userPosts.posts.map((post) => (
                <div key={post.id} className="aspect-square">
                  {post.files[0].toLowerCase().endsWith(".png") ||
                  post.files[0].toLowerCase().endsWith(".jpg") ? (
                    <Image
                      src={post.files[0]}
                      width={100}
                      height={100}
                      alt="Post"
                      className="aspect-square"
                    />
                  ) : post.files[0].toLowerCase().endsWith(".mp4") ? (
                    <video
                      src={post.files[0]}
                      className="w-[100px] h-[100px]"
                    />
                  ) : (
                    <p>Unsupported file format</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
