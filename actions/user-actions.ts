"use server";
import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "@/lib/user-service";
import { User } from "@clerk/nextjs/server";

export const getUsersQuery = async (value: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");

    const users = await db.user.findMany({
      where: {
        username: {
          contains: value,
          not: currentUser.username,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const followingIds = await db.follow.findMany({
      where: {
        followerId: currentUser.id,
      },
      select: {
        followingId: true,
      },
    });
    const sortedUsers = users.sort((a, b) => {
      const aIsFollowed: boolean = followingIds.some(
        (follow) => follow.followingId === a.id
      );
      const bIsFollowed: boolean = followingIds.some(
        (follow) => follow.followingId === b.id
      );

      return bIsFollowed ? 1 : aIsFollowed ? -1 : 0;
    });

    if (!sortedUsers) return [];
    return sortedUsers;
  } catch (error) {
    console.log("ERROR_GET_USER_QUERY", error);
    throw error;
  }
};

export const setUserOnline = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        online: true,
      },
    });
  } catch (error) {
    console.error("ERROR_USERS_ACTION, setUserOnline", error);
    throw error;
  }
};

export const setUserOffline = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        online: false,
      },
    });
  } catch (error) {
    console.error("ERROR_USERS_ACTION, setUserOffline", error);
    throw error;
  }
};
