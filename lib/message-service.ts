import db from "./db";
import { getCurrentUser } from "./user-service";

export const getMessages = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("Unauthorized");

    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!messages) throw new Error("Messages not found");
    return messages;
  } catch (error) {
    console.log("ERROR_GET_MESSAGES", error);
    return [];
  }
};
