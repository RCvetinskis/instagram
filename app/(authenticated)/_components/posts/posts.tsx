"use client";
import { useEffect } from "react";
import { PostCard, PostCardSkeleton } from "./post-card";
import { UserCommentsExtentedPost } from "@/types";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoadMorePosts from "@/hooks/useLoadMorePosts";
import { Spinner } from "@/components/loading/spinner";

interface PostsProps {
  initialPosts: UserCommentsExtentedPost[];
  noPostsText?: string;
  variant: "home" | "explore";
}
export const Posts = ({ initialPosts, noPostsText, variant }: PostsProps) => {
  const currentUser = useCurrentUser();

  const { ref, hasMoreData, data, setData } = useLoadMorePosts(
    variant,
    initialPosts
  );

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser.id);

      const newPostHandler = (post: UserCommentsExtentedPost) => {
        setData((current) => {
          if (find(current, { id: post.id })) return current;

          return [post, ...current];
        });
      };
      pusherClient.bind("post:new", newPostHandler);

      return () => {
        pusherClient.unsubscribe(currentUser.id);
        pusherClient.unbind("post:new", newPostHandler);
      };
    }
  }, [currentUser]);

  if (!data || data.length === 0) {
    return <h1 className="text-3xl text-center">{noPostsText}</h1>;
  }
  return (
    <div className="flex flex-col flex-wrap gap-10 items-center justify-center mb-12 ">
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasMoreData && (
        <div ref={ref} className="flex justify-center items-center p-1 w-full">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export const PostsSkeleton = () => {
  return (
    <div className="flex flex-col flex-wrap gap-10 items-center justify-center">
      {[...Array(5)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
};
