"use server";
import { getCurrentUser } from "./user-service";

import db from "./db";

export const isFollowing = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const otherUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!otherUser) throw new Error("User not found");

    if (otherUser.id === currentUser.id) return true;

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: currentUser.id,
        followingId: otherUser.id,
      },
    });
    return !!existingFollow;
  } catch (error) {
    console.log("ERROR_ISFOLLOWING", error);
    return false;
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const followers = await db.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });

    if (!followers) return [];

    return followers;
  } catch (error) {
    console.log("ERROR_GET_FOLLOWERS", error);
    return [];
  }
};

export const getFollowingUsers = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const followers = await db.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true,
      },
    });
    if (!followers) return [];

    return followers;
  } catch (error) {
    console.log("ERROR_GET_FOLLOWING_USERS", error);
    return [];
  }
};

export const getFollowsCount = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        followedBy: true,
        following: true,
      },
    });
    const followersCount = user?.followedBy.length || 0;

    const followingUsersCount = user?.following.length || 0;

    return { followersCount, followingUsersCount };
  } catch (error) {
    console.log("ERROR_GET_FOLLOWING_USERS", error);
    return { followersCount: 0, followingUsersCount: 0 };
  }
};
