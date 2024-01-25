"use server";
import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { utapi } from "@/lib/uploadthing";
import { getCurrentUser } from "@/lib/user-service";
import { revalidatePath } from "next/cache";

export const onSendMessage = async (formData: FormData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");

    const file = formData.get("file");
    let fileUrl;

    if (file) {
      const uploadedFile = await utapi.uploadFiles(file);
      if (!uploadedFile || uploadedFile.error) {
        throw new Error("Error uploading file");
      }
      fileUrl = uploadedFile.data.url;
    }

    const message = formData.get("message") as string;

    const conversationId = formData.get("conversationId") as string;

    const senderId = formData.get("senderId") as string;

    const newMessage = await db.message.create({
      data: {
        message: message,
        file: fileUrl,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: senderId || currentUser.id,
          },
        },
      },
      include: {
        sender: true,
      },
    });
    if (!newMessage) throw new Error("Failed to create message");

    const updatedConversation = await db.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });

    revalidatePath(`/user/${currentUser.username}/conversations`);
    revalidatePath(
      `/user/${currentUser.username}/conversations/${updatedConversation.id}`
    );

    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.forEach((user) => {
      if (user.username) {
        pusherServer.trigger(user.username, "conversation:update", {
          id: conversationId,
          messages: [lastMessage],
        });
      }
    });

    return newMessage;
  } catch (error) {
    console.log("ERROR_ACTION_ON_SEND_MESSAGE", error);
    throw error;
  }
};
