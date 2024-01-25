import { getCurrentUser } from "@/lib/user-service";
import { redirect } from "next/navigation";
import {
  ScreenConversationSkeleton,
  ScreenConversations,
} from "../_components/screens/screen-conversations";
import { Suspense } from "react";
import { ConversationPageSkeleton } from "./page";

type paramsType = { username: string };

interface ConversationsLayoutProps {
  children: React.ReactNode;
  params: paramsType;
}

const ConversationLayout = async ({
  children,
  params,
}: ConversationsLayoutProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }
  // prevents to check other users conversations
  if (currentUser.username !== params.username) {
    redirect(`/user/${currentUser?.username}/conversations`);
  }

  return (
    <div className="flex h-screen w-full md:pt-5 gap-1">
      <div className="hidden md:block  md:min-w-[300px] lg:w-1/2     shadow-3xl shadow-black rounded ">
        <Suspense fallback={<ScreenConversationSkeleton />}>
          <ScreenConversations />
        </Suspense>
      </div>

      <div className="w-full   shadow-3xl  shadow-black rounded">
        <Suspense fallback={<ConversationPageSkeleton />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default ConversationLayout;
