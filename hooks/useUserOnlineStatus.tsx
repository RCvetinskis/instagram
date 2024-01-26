"use client";
import { pusherClient } from "@/lib/pusher";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const userUserOnlineStatuts = (initialUser: User) => {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const channel = `users-channel-${user.id}`;
    pusherClient.subscribe(channel);

    const onlineHandler = (user: User) => {
      setUser((prev) => {
        if (prev.online === user.online) return prev;
        return user;
      });
    };

    pusherClient.bind("user:status", onlineHandler);

    return () => {
      pusherClient.unsubscribe(channel);
      pusherClient.unbind("user:status", onlineHandler);
    };
  }, [user]);

  return user;
};

export default userUserOnlineStatuts;
