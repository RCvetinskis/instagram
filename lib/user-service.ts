import { redirect } from "next/navigation";
import db from "./db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export const getCurrentUser = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const currentUser = await db.user.findUnique({
    where: {
      externalUserId: userId,
    },
  });

  if (!currentUser) return null;
  return currentUser;
};

export const getSuggestedUsers = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Unauthorized");

  const followingUsers = await db.follow.findMany({
    where: {
      followerId: currentUser.id,
    },
  });

  const suggestedUsers = await db.user.findMany({
    where: {
      id: {
        not: currentUser?.id,
      },
      followedBy: {
        none: {
          followingId: {
            in: followingUsers.map(
              (followingUser) => followingUser.followingId
            ),
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  revalidatePath("/");
  revalidatePath(`/user/${currentUser.username}`);
  return suggestedUsers;
};

export const getUserByUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) redirect("/");
  return user;
};
