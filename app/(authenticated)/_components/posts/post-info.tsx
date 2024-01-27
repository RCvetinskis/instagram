"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserLabel } from "@/components/user/user-label";
import { UserCommentsExtentedPost, UserExtendedComment } from "@/types";
import { CommentForm } from "./comments/comment-form";
import { PostComments } from "./comments/post-comments";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import useIsAuthor from "@/hooks/useIsAuthor";
import { ModalDeletePost } from "@/components/modals/modal-delete-post";

interface PostInfoProps {
  post: UserCommentsExtentedPost;
}
export const PostInfo = ({ post }: PostInfoProps) => {
  const [comments, setComments] = useState<UserExtendedComment[]>(
    post.comments
  );

  useEffect(() => {
    pusherClient.subscribe(post.id);

    const commentHandler = (comment: UserExtendedComment) => {
      setComments((current) => {
        if (find(current, { id: comment.id })) return current;

        return [comment, ...current];
      });
    };

    pusherClient.bind("comments:new", commentHandler);

    return () => {
      pusherClient.unsubscribe(post.id);
      pusherClient.unbind("comments:new", commentHandler);
    };
  }, [post.id]);

  const isAuthor = useIsAuthor(post.id);

  return (
    <Card className="h-full w-full flex flex-col  border-none  ">
      <CardHeader className="px-3  py-2 shadow-4xl rounded flex flex-row justify-between items-center ">
        <div>
          <div className="flex items-center gap-3">
            <UserLabel
              user={post.author}
              href={`/user/${post.author.username}`}
              side="bottom"
              align="center"
            />
            <CardTitle className="text-sm  capitalize">{post.title}</CardTitle>
          </div>

          <CardDescription className="text-gray-500  overflow-auto max-h-[50px] py-1">
            {post.description}
          </CardDescription>
        </div>
        {isAuthor && <ModalDeletePost postId={post.id} />}
      </CardHeader>

      {/* comments */}
      <CardContent className="px-3 py-1 flex-1 overflow-y-auto shadow-3xl rounded my-2 ">
        <PostComments comments={comments} />
      </CardContent>

      {/* comment input*/}

      <CardFooter className=" mb-[20px] w-full shadow-3xl rounded">
        <CommentForm postId={post.id} />
      </CardFooter>
    </Card>
  );
};
