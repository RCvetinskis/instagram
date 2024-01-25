"use server";

import { getCurrentUser } from "@/lib/user-service";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// TODO: fix follow logic
export const onFollowUser = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");

    const otherUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!otherUser) throw new Error("User does not exist");
    if (otherUser.id === currentUser.id)
      throw new Error("Cannot follow yourself");

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: otherUser.id,
      },
    });

    if (existingFollow) throw new Error("Alredy following");

    const follow = await db.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: otherUser.id,
      },
      include: {
        following: true,
      },
    });

    if (!follow) throw new Error("Something went wrong");
    revalidatePath("/");
    revalidatePath(`/user/${currentUser.username}`);
    return follow;
  } catch (error) {
    console.log("ERROR_ON_FOLLOW_USER");
    throw error;
  }
};

export const onUnfollowUser = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");

    const otherUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!otherUser) throw new Error("User does not exist");

    if (otherUser.id === currentUser.id)
      throw new Error("Cannot unfollow yourself");

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: otherUser.id,
      },
    });

    if (!existingFollow) throw new Error("Not Following");

    const follow = await db.follow.delete({
      where: { id: existingFollow.id },
      include: {
        following: true,
      },
    });

    revalidatePath("/");
    revalidatePath(`/user/${currentUser.username}`);

    if (!follow) throw new Error("Something went wrong");
    return follow;
  } catch (error) {
    console.log("ERROR_ON_UN_FOLLOW_USER");
    throw error;
  }
};
