"use client";

import { useEffect, useRef, useState } from "react";

import { SenderExtentedMessages } from "@/types";
import {
  MessageContainer,
  MessageContainerSkeleton,
} from "./message-container";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";

interface MessagesProps {
  initialMessages: SenderExtentedMessages[];
  conversationId: string;
}
export const Messages = ({
  initialMessages,
  conversationId,
}: MessagesProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (newMessage: SenderExtentedMessages) => {
      setMessages((current) => {
        if (find(current, { id: newMessage.id })) return current;
        return [...current, newMessage];
      });
      bottomRef?.current?.scrollIntoView();
    };

    pusherClient.bind("messages:new", messageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageContainer key={message.id} message={message} />
      ))}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export const MessagesSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      {[...Array(6)].map((_, i) => (
        <MessageContainerSkeleton key={i} />
      ))}

      <Skeleton className="pt-24" />
    </div>
  );
};
