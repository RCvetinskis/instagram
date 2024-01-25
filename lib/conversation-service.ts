import { getCurrentUser } from "./user-service";
import db from "./db";
export const getUserConversations = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");

    const conversations = await db.conversation.findMany({
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    if (!conversations) throw new Error("Conversation not found");
    return conversations;
  } catch (error) {
    console.log("ERROR_CONVERSATION_SERVICE_GET_CONVERSATIONS", error);
    return [];
  }
};

export const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");
    if (!conversationId) throw new Error("No id provided");
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!conversation) throw new Error("Conversation not found");
    return conversation;
  } catch (error) {
    console.log("ERROR_CONVERSATION_SERVICE_GET_CONVERSATION_BY_ID", error);
    return null;
  }
};
