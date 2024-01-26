"use client";
import { ModalShowPost } from "@/components/modals/modal-show-post";
import { UserPostCard, UserPostCardSkeleton } from "./user-post-card";
import { UserCommentsExtentedPost } from "@/types";
interface UserPostsProps {
  posts: UserCommentsExtentedPost[];
}
export const UserPosts = ({ posts }: UserPostsProps) => {
  if (!posts || posts.length === 0) {
    return <h1 className="text-3xl text-center ">User has no posts.</h1>;
  }
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center w-full rounded shadow-3xl shadow-black py-6">
      {posts.map((post) => (
        <ModalShowPost key={post.id} post={post}>
          <UserPostCard post={post} />
        </ModalShowPost>
      ))}
    </div>
  );
};

export const UserPostsSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center w-full rounded ">
      {[...Array(3)].map((_, i) => (
        <UserPostCardSkeleton key={i} />
      ))}
    </div>
  );
};
