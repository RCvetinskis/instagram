import { NextApiRequest, NextApiResponse } from "next";

import { pusherServer } from "@/lib/pusher";

import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { userId } = getAuth(request);

  if (!userId) {
    return response.status(401);
  }

  const user = userId ? await clerkClient.users.getUser(userId) : null;

  if (!user?.username) {
    return response.status(401);
  }
  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: user.username,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
  return response.send(authResponse);
}
