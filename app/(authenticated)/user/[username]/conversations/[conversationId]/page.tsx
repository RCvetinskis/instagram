import { getConversationById } from "@/lib/conversation-service";
import { getCurrentUser } from "@/lib/user-service";
import { ConversationHeader } from "./_components/conversation-header";
import { Messages } from "./_components/messages";
import { SendMessage } from "./_components/send-message";
import { getMessages } from "@/lib/message-service";
import { redirect } from "next/navigation";
import { ConversationPageSkeleton } from "./_components/ConversationpageSkeleton";
type paramsType = { username: string; conversationId: string };

interface ConversationPageProps {
  params: paramsType;
}
const ConversationPage = async ({ params }: ConversationPageProps) => {
  const conversation = await getConversationById(params?.conversationId);
  const currentUser = await getCurrentUser();
  const messages = await getMessages(params?.conversationId);

  if (!currentUser) {
    return <ConversationPageSkeleton />;
  }
  if (!conversation) {
    redirect(`/user/${currentUser.username}/conversations`);
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        conversation={conversation}
        currentUsername={currentUser.username}
      />

      <Messages
        initialMessages={messages}
        conversationId={params?.conversationId}
      />

      <footer className="relative mb-[70px]  px-4 md:mb-2 ">
        <SendMessage
          conversationId={conversation.id}
          currentUserId={currentUser.id}
        />
      </footer>
    </div>
  );
};

export default ConversationPage;
