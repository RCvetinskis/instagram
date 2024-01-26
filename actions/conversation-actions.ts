"use server";

import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "@/lib/user-service";
import { CreateConversationType } from "@/types";
import { revalidatePath } from "next/cache";

export const onCreateConversation = async (props: CreateConversationType) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const { userId, isGroup, members, name } = props;

    if (isGroup && (!members || members.length < 2 || !name))
      throw new Error("Something is missing to create group chat");

    if (isGroup && members) {
      const newConversation = await db.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { userId: string }) => ({
                id: member.userId,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      if (!newConversation)
        throw new Error("Failed to create group conversation");

      revalidatePath(`/user${currentUser.username}/conversations`);
      revalidatePath(
        `/user${currentUser.username}/conversations/${newConversation.id}`
      );

      newConversation.users.forEach((user) => {
        if (user.username) {
          pusherServer.trigger(
            user.username,
            "conversation:new",
            newConversation
          );
        }
      });

      return {
        conversationId: newConversation.id,
        currentUsername: currentUser.username,
      };
    }

    if (userId) {
      const existingConversation = await db.conversation.findMany({
        where: {
          OR: [
            {
              userIds: {
                equals: [currentUser.id, userId],
              },
            },
            {
              userIds: {
                equals: [userId, currentUser.id],
              },
            },
          ],
        },
        include: {
          users: true,
        },
      });

      const singleConversation = existingConversation[0];
      if (singleConversation) {
        return {
          conversationId: singleConversation.id,
          currentUsername: currentUser.username,
        };
      }

      const newConversation = await db.conversation.create({
        data: {
          users: {
            connect: [{ id: currentUser.id }, { id: userId }],
          },
        },
        include: {
          users: true,
        },
      });

      if (!newConversation) throw new Error("Failed to create conversation");

      newConversation.users.forEach((user) => {
        if (user.username) {
          pusherServer.trigger(
            user.username,
            "conversation:new",
            newConversation
          );
        }
      });

      revalidatePath(`/user${currentUser.username}/conversations`);
      revalidatePath(
        `/user${currentUser.username}/conversations/${newConversation.id}`
      );

      return {
        conversationId: newConversation.id,
        currentUsername: currentUser.username,
      };
    }
  } catch (error) {
    console.log("ERROR_ACTION_ONSTART_CONVERSATION", error);
    throw error;
  }
};

export const onConversationDelete = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const currentConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!currentConversation) throw new Error("Conversation not found");

    const deletedConversation = await db.conversation.delete({
      where: {
        id: currentConversation.id,
      },
    });
    revalidatePath(`/user${currentUser.username}/conversations`);
    revalidatePath(
      `/user${currentUser.username}/conversations/${deletedConversation.id}`
    );

    currentConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.username, "conversation:delete", {
          conversation: currentConversation,
        });
      }
    });

    return deletedConversation;
  } catch (error) {
    console.log("ERROR_ACTIONS_CONVERSATION, onConversationLeave", error);
    throw error;
  }
};

export const onUpdateConversationName = async (
  conversationId: string,
  conversationName: string
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const currentConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!currentConversation) throw new Error("Conversation not found");

    const updatedConversation = await db.conversation.update({
      where: {
        id: currentConversation.id,
        isGroup: true,
      },
      data: {
        name: conversationName,
      },
    });
    revalidatePath(`/user${currentUser.username}/conversations`);
    revalidatePath(
      `/user${currentUser.username}/conversations/${updatedConversation.id}`
    );

    currentConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.username, "conversation:update", {
          conversation: currentConversation,
        });
      }
    });

    return updatedConversation;
  } catch (error) {
    console.log("ERROR_ACTIONS_CONVERSATION, onConversationLeave", error);
    throw error;
  }
};
