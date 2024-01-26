"use client";
import { UserConversationMessageProps } from "@/types";
import {
  ConversationPreview,
  ConversationPreviewSkeleton,
} from "./conversation-preview";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";

interface ScreenConversationsProps {
  initialConversations: UserConversationMessageProps[];
  currentUsername: string;
}
export const ConversationsContainer = ({
  initialConversations,
  currentUsername,
}: ScreenConversationsProps) => {
  const [conversations, setConversations] = useState(initialConversations);

  const { conversationId } = useConversation();

  useEffect(() => {
    if (!currentUsername) return;

    pusherClient.subscribe(currentUsername);

    const newHandler = (conversation: UserConversationMessageProps) => {
      setConversations((current) => {
        if (find(current, { id: conversation.id })) return current;

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: UserConversationMessageProps) => {
      setConversations((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            console.log(conversation.messages);
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const deleteHandler = (conversation: UserConversationMessageProps) => {
      setConversations((current) =>
        current.filter(
          (currentConversation) => currentConversation.id !== conversation.id
        )
      );
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);

    return () => {
      pusherClient.unsubscribe(currentUsername);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [currentUsername, initialConversations, conversationId]);

  const [inputValue, setInputValue] = useState("");

  const filteredConversations = useMemo(() => {
    if (!inputValue || inputValue.length === 0) {
      return conversations;
    }

    const lowerCaseInput = inputValue.toLowerCase();

    return conversations.filter((conversation) =>
      conversation.isGroup
        ? conversation.name?.toLowerCase().includes(lowerCaseInput)
        : conversation.users.some((user) =>
            user.username.toLowerCase().includes(lowerCaseInput)
          )
    );
  }, [conversations, inputValue]);

  const onClear = () => {
    setInputValue("");
  };
  return (
    <div className="w-full">
      <div className="group relative ">
        <Input
          placeholder="Search"
          className="rounded outline-none border-none shadow-3xl   shadow-black/75 focus:shadow-black mb-6"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue.length > 0 && (
          <XCircle
            className="absolute top-3 right-2 cursor-pointer hover:text-gray-500 transition-all"
            size={18}
            onClick={onClear}
          />
        )}
      </div>
      <h2 className="my-2">Messages</h2>
      {filteredConversations.map((conversation) => (
        <ConversationPreview
          key={conversation.id}
          conversation={conversation}
          currentUsername={currentUsername}
        />
      ))}
    </div>
  );
};

export const ConversationsContainerSkeleton = () => {
  return (
    <div className="w-full">
      <Skeleton className="rounded shadow-3xl shadow-black/75 bg-gray-500 w-full h-[50px] " />

      <h2 className="my-2">Messages</h2>
      <Skeleton className="my-2 bg-gray-500 w-1/4 h-[20px] rounded" />

      {[...Array(5)].map((_, i) => (
        <ConversationPreviewSkeleton key={i} />
      ))}
    </div>
  );
};
