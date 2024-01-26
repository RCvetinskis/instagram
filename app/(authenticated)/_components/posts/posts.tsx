"use client";
import { useEffect, useState } from "react";
import { PostCard, PostCardSkeleton } from "./post-card";
import { UserCommentsExtentedPost } from "@/types";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import useCurrentUser from "@/hooks/useCurrentUser";

interface PostsProps {
  initialPosts: UserCommentsExtentedPost[];

  noPostsText?: string;
}
export const Posts = ({
  initialPosts,

  noPostsText,
}: PostsProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser.id);

      const newPostHandler = (post: UserCommentsExtentedPost) => {
        setPosts((current) => {
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

  if (!posts || posts.length === 0) {
    return <h1 className="text-3xl text-center">{noPostsText}</h1>;
  }
  return (
    <div className="flex flex-wrap gap-10 items-center justify-center mb-12 ">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export const PostsSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-10 items-center justify-center">
      {[...Array(5)].map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
};
