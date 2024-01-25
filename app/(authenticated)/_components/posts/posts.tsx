import { PostCard, PostCardSkeleton } from "./post-card";
import { UserCommentsExtentedPost } from "@/types";

interface PostsProps {
  posts: UserCommentsExtentedPost[];
  noPostsText?: string;
}
export const Posts = ({ posts, noPostsText }: PostsProps) => {
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
