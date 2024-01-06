import db from "./db";

import { auth } from "@clerk/nextjs";

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

  if (!currentUser) return null;

  const suggestedUsers = await db.user.findMany({
    where: {
      id: {
        not: currentUser.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  //   TODO: do not include users that are blocked or already followed
  return suggestedUsers;
};
