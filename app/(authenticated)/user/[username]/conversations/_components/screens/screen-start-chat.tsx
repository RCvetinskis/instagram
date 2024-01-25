"use client";
import { ModalStartChat } from "@/components/modals/chat/modal-start-chat";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { MessageCircleHeart } from "lucide-react";
import { useEffect, useState } from "react";

export const ScreenStartChat = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="flex justify-center items-center h-full  flex-col gap-2 ">
        <div className="border-4 border-inherit rounded-full w-fit p-3">
          <Skeleton className="h-16 w-16 bg-gray-500 rounded-full " />
        </div>
        <Skeleton className="text-2xl font-bold">Your messages</Skeleton>
        <Skeleton className="text-sm">
          Send private photos and messages to friend or group
        </Skeleton>

        <Skeleton className="text-white bg-sky-500 h-10 px-4 py-2 rounded-xl">
          Send message
        </Skeleton>
      </main>
    );
  }
  return (
    <main className="flex justify-center items-center h-full flex-col gap-2">
      <div className="border-4 border-inherit rounded-full w-fit p-3">
        <MessageCircleHeart className="text-inherit" size={64} />
      </div>
      <h1 className="text-2xl font-bold">Your messages</h1>
      <p className="text-sm">
        Send private photos and messages to friend or group
      </p>
      <ModalStartChat>
        <Button variant={"primary"} className="rounded-xl">
          Send message
        </Button>
      </ModalStartChat>
    </main>
  );
};
