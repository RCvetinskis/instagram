import {
  User,
  Post,
  Comment,
  Follow,
  Conversation,
  Message,
} from "@prisma/client";

export interface UserExtendedPost extends Post {
  author: User;
}

export interface UserCommentsExtentedPost extends Post {
  author: User;
  comments: UserExtendedComment[];
}

export interface UserExtendedComment extends Comment {
  author: User;
}

export interface UserFollowingProps extends Follow {
  follower: User;
}

export interface UserFollowersProps extends Follow {
  following: User;
}

export interface UserConversationMessageProps extends Conversation {
  users: User[];
  messages: Message[];
}

export interface UserConversationProps extends Conversation {
  users: User[];
}

export interface SenderExtentedMessages extends Message {
  sender: User;
}

export type CreateConversationType = {
  userId?: string;
  isGroup?: boolean;
  members?: { userId: string }[];
  name?: string;
};

export type SendMessageType = {
  senderId: string;
  message?: string;
  conversationId: string;
};
