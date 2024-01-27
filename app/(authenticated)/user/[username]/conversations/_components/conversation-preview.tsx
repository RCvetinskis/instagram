"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user/user-avatar";
import useConversation from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import { UserConversationMessageProps } from "@/types";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface ConversationPreviewProps {
  conversation: UserConversationMessageProps;
  currentUsername: string;
}
export const ConversationPreview = ({
  conversation,
  currentUsername,
}: ConversationPreviewProps) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const { theme } = useTheme();

  const otherUser = useMemo(
    () =>
      conversation.users.filter((user) => user.username !== currentUsername),
    [conversation.userIds]
  );

  const groupUsers = useMemo(
    () => conversation.users.slice(0, 3),
    [conversation.userIds]
  );

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  }, [conversation.messages]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.file) return "Sent an image";
    if (lastMessage?.message) return lastMessage.message;
    return "No messages";
  }, [lastMessage]);

  const handleClick = useCallback(() => {
    router.push(`/user/${currentUsername}/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const themeLight = theme === "light";

  const selectedStyle =
    conversationId === conversation.id &&
    (themeLight ? "shadow-black/25" : "shadow-gray-500");

  const hoverStyle = themeLight
    ? "hover:shadow-black/25"
    : "hover:shadow-gray-500";

  return (
    <div
      onClick={handleClick}
      suppressHydrationWarning
      className={cn(
        "my-4 p-2  rounded-xl shadow-4xl   cursor-pointer ",
        !themeLight && "shadow-gray-700",
        hoverStyle,
        selectedStyle
      )}
    >
      {conversation.isGroup && (
        <div className="flex  items-center gap-2 ">
          <div className="flex flex-wrap  space-x-4 w-[80px]">
            {groupUsers.map((user) => (
              <UserAvatar key={user.id} user={user} />
            ))}
          </div>
          <div>
            <p className="capitalize">{conversation.name}</p>
            <p className="text-foreground text-gray-500  text-sm truncate">
              {lastMessageText}
            </p>
          </div>
        </div>
      )}

      {!conversation.isGroup && (
        <div className="flex  items-center gap-2 ">
          <UserAvatar user={otherUser[0]} />
          <div>
            <p className="capitalize">{otherUser[0].username}</p>
            <p className="text-foreground text-gray-500 text-sm truncate">
              {lastMessageText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ConversationPreviewSkeleton = () => {
  return (
    <div className="my-4 p-2  rounded-xl  shadow-4xl shadow-gray-700  ">
      <div className="flex  items-center gap-2 ">
        <UserAvatarSkeleton />

        <div>
          <Skeleton className="bg-gray-500 w-[70px] h-[20px] rounded" />
          <Skeleton className="bg-gray-500 w-[60px] h-[15px] rounded" />
        </div>
      </div>
    </div>
  );
};
