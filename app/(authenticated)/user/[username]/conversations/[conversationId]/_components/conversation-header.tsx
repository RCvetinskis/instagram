"use client";
import { ModalConversationSettings } from "@/components/modals/chat/modal-conversation-settings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user/user-avatar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { UserConversationProps } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ConversationHeaderProps {
  conversation: UserConversationProps;
  currentUsername: string;
}
export const ConversationHeader = ({
  conversation,
  currentUsername,
}: ConversationHeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const otherUser = useMemo(
    () =>
      conversation.users.filter((user) => user.username !== currentUsername),

    [conversation.userIds]
  );

  const groupUsers = useMemo(
    () => conversation.users.slice(0, 3),
    [conversation.userIds]
  );

  return (
    <header className="shadow-4xl shadow-neutral-800 py-1 md:px-2 ">
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Link href={`/user/${currentUsername}/conversations`}>
              <Button
                variant={"ghost"}
                className="hover:text-gray-500 transition"
              >
                <ArrowLeft size={18} />
              </Button>
            </Link>
          )}

          {conversation.isGroup && (
            <div className="flex  items-center gap-2 ">
              <div className="flex flex-wrap  space-x-4 w-[80px]">
                {groupUsers.map((user) => (
                  <Link key={user.id} href={`/user/${user.username}`}>
                    <UserAvatar user={user} />
                  </Link>
                ))}
              </div>
              <div className="mb-3">
                <p className="capitalize">{conversation.name}</p>
                <p className="text-foreground text-gray-500 group-hover:text-black text-sm truncate">
                  Active
                </p>
              </div>
            </div>
          )}
          {!conversation.isGroup && (
            <div className="flex  items-center gap-2 ">
              <Link href={`/user/${otherUser[0].username}`}>
                <UserAvatar user={otherUser[0]} />
              </Link>

              <div>
                <p className="capitalize">{otherUser[0].username}</p>
                <p className="text-foreground text-gray-500 group-hover:text-black text-sm truncate">
                  Active
                </p>
              </div>
            </div>
          )}
        </div>
        <ModalConversationSettings
          conversation={conversation}
          otherUser={otherUser[0]}
        />
      </div>
    </header>
  );
};

export const ConversationHeaderSkeleton = () => {
  return (
    <header className="shadow-4xl shadow-neutral-800 min-h-16">
      <div className="p-2 flex items-center justify-between">
        <div className="flex  items-center gap-2 ">
          <UserAvatarSkeleton />

          <div className="flex flex-col gap-2">
            <Skeleton className="bg-gray-500 w-[100px] h-[20px] rounded" />
            <Skeleton className="bg-gray-500 w-[70px] h-[15px] rounded" />
          </div>
        </div>

        <Skeleton>...</Skeleton>
      </div>
    </header>
  );
};
