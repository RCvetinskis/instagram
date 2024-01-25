"use server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/user-service";
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
