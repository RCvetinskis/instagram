"use server";
import { getCurrentUser } from "@/lib/user-service";
import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export const onCreateComment = async (postId: string, comment: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");
    if (!comment) throw new Error("No comment");

    const currentPost = await db.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!currentPost) throw new Error("Post not found");

    const newComment = await db.comment.create({
      data: {
        authorId: currentUser.id,
        postId: currentPost.id,
        comment,
      },
      include: {
        author: true,
      },
    });
    if (!newComment) throw new Error("Failed to create new comment");

    const updatedPost = await db.post.update({
      where: {
        id: currentPost.id,
      },
      data: {
        comments: {
          connect: {
            id: newComment.id,
          },
        },
      },
      include: {
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    const commentUpdated = updatedPost.comments.filter(
      (comment) => comment.id === newComment.id
    );
    await pusherServer.trigger(postId, "comments:new", commentUpdated[0]);

    if (!updatedPost) throw new Error("Post not updated");

    await pusherServer.trigger(
      postId,
      "comments:length",
      updatedPost.comments.length
    );
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/user/${currentUser.username}`);
    return newComment;
  } catch (error) {
    console.log("ERROR ON_COMMENT_ACTION");
    throw error;
  }
};
