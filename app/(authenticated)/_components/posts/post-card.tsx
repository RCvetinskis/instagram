"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider, SliderSkeleton } from "@/components/slider";
import { TimeAgo, TimeAgoSkeleton } from "@/components/time-ago";
import { UserLabel } from "@/components/user/user-label";
import { UserAvatarSkeleton } from "@/components/user/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCommentsExtentedPost } from "@/types";
import { ModalShowPost } from "@/components/modals/modal-show-post";
import useCommentsLength from "@/hooks/useCommentsLength";
import { ModalDeletePost } from "@/components/modals/modal-delete-post";
import useIsAuthor from "@/hooks/useIsAuthor";

interface PostCardProps {
  post: UserCommentsExtentedPost;
}
export const PostCard = ({ post }: PostCardProps) => {
  const commentsLength = useCommentsLength(post.id, post.comments.length);

  const isAuthor = useIsAuthor(post.id);
  return (
    <Card className="p-1 border-none w-full lg:w-[500px] xl:w-[700px] rounded shadow-3xl py-4 shadow-black ">
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="flex items-center gap-3 ">
          <UserLabel
            user={post.author}
            href={`/user/${post.author.username}`}
            side="bottom"
            align="center"
          />

          <TimeAgo createdAt={post.createdAt} />
        </span>
        {isAuthor && <ModalDeletePost postId={post.id} />}
      </CardHeader>

      <CardContent>
        <Slider files={post.files} prevArrow="-left-3" nextArrow="-right-3" />
        <CardTitle className="text-sm">
          <span className="capitalize"> {post.author.username}</span>
          <span className="text-sm text-gray-500 font-normal ml-2">
            {post.title}
          </span>
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
        <ModalShowPost post={post}>
          <div className="text-xs font-bold hover:border-b transition h-8 py-2 px-3 rounded-xl">
            View All Comments {commentsLength}
          </div>
        </ModalShowPost>
      </CardContent>
    </Card>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className="p-1 border-none w-full lg:w-[500px] xl:w-[700px] rounded shadow-3xl py-4 shadow-black ">
      <header className="flex flex-row items-center justify-between">
        <span className="flex items-center gap-3">
          <UserAvatarSkeleton />
          <TimeAgoSkeleton />
        </span>
        <Skeleton className="bg-gray-500 rounded-full w-[20px] h-[20px]" />
      </header>
      <section>
        <SliderSkeleton />
        <header>
          <Skeleton className="w-[100px] h-[20px] bg-gray-500 my-1" />
          <Skeleton className="w-[70px] h-[20px] bg-gray-500 my-1" />
        </header>
        <div>
          <Skeleton className="w-[100px] h-[20px] bg-gray-500 my-1" />
        </div>
      </section>
    </div>
  );
};
