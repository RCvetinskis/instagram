"use client";

import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";

const useCommentsLength = (postId: string, initialLength: number) => {
  const [commentsLength, setCommentsLength] = useState<number>(
    initialLength || 0
  );
  useEffect(() => {
    pusherClient.subscribe(postId);

    const commentsLengthHandler = (commentsLength: number) => {
      setCommentsLength((current) => {
        if (current === commentsLength) return current;

        return commentsLength;
      });
    };
    pusherClient.bind("comments:length", commentsLengthHandler);

    return () => {
      pusherClient.unsubscribe(postId);
      pusherClient.unbind("comments:length", commentsLengthHandler);
    };
  }, [postId]);
  return commentsLength;
};

export default useCommentsLength;
