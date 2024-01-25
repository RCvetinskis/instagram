import { HoverLabel } from "@/components/hover-label";
import { ModalStartChat } from "@/components/modals/chat/modal-start-chat";
import { getUserConversations } from "@/lib/conversation-service";
import { getCurrentUser } from "@/lib/user-service";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import {
  ConversationsContainer,
  ConversationsContainerSkeleton,
} from "../conversations-container";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

export const ScreenConversations = async () => {
  const currentUser = await getCurrentUser();

  const conversations = await getUserConversations();
  if (!currentUser) {
    redirect("/");
  }

  return (
    <div className="py-2 h-full overflow-y-auto">
      <header className="flex justify-between shadow-4xl shadow-neutral-800 px-2 h-14">
        <HoverLabel side="bottom" label="Profile">
          <Link
            className="capitalize hover:text-gray-500 hover:border-b border-gray-500 transition-all"
            href={`/user/${currentUser.username}`}
          >
            {currentUser.username}
          </Link>
        </HoverLabel>
        <HoverLabel label="New message" side="bottom">
          <ModalStartChat>
            <MessageSquarePlus className="cursor-pointer hover:text-gray-500 transition-all" />
          </ModalStartChat>
        </HoverLabel>
      </header>

      <main className="my-4 p-2">
        <ConversationsContainer
          currentUsername={currentUser.username}
          initialConversations={conversations}
        />
      </main>
    </div>
  );
};

export const ScreenConversationSkeleton = () => {
  return (
    <div className="py-2 h-full overflow-y-auto">
      <header className="flex justify-between gap-2 shadow-4xl shadow-neutral-800 px-2 h-14">
        <Skeleton className="bg-gray-500 w-[100px] rounded h-[20px]" />
        <Skeleton className="bg-gray-500 w-[30px] rounded h-[30px]" />
      </header>

      <main className="my-4 p-2">
        <ConversationsContainerSkeleton />
      </main>
    </div>
  );
};
