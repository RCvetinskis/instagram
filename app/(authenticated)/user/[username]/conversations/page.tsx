import { Suspense } from "react";
import {
  ScreenConversationSkeleton,
  ScreenConversations,
} from "./_components/screens/screen-conversations";
import { ScreenStartChat } from "./_components/screens/screen-start-chat";

const ConversationsPage = () => {
  return (
    <div className="flex h-screen w-full md:pt-5 gap-1">
      <div className="flex-grow  md:min-w-[300px] lg:w-1/2  shadow-3xl shadow-black rounded ">
        <Suspense fallback={<ScreenConversationSkeleton />}>
          <ScreenConversations />
        </Suspense>
      </div>
      <div className="hidden md:block md:container shadow-3xl  shadow-black rounded">
        <ScreenStartChat />
      </div>
    </div>
  );
};

export default ConversationsPage;
