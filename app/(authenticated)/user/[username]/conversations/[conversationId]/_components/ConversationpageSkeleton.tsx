import { ConversationHeaderSkeleton } from "./conversation-header";
import { MessagesSkeleton } from "./messages";
import { SendMessageSkeleton } from "./send-message";

export const ConversationPageSkeleton = () => {
  return (
    <div className="flex flex-col h-full w-full ">
      <ConversationHeaderSkeleton />
      <MessagesSkeleton />
      <footer className="relative mb-[70px] px-4 md:mb-2 ">
        <SendMessageSkeleton />{" "}
      </footer>
    </div>
  );
};
