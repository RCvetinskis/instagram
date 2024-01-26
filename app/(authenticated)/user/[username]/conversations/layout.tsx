import { getCurrentUser } from "@/lib/user-service";
import { redirect } from "next/navigation";

type usernameType = { username: string };

interface ConversationsLayoutProps {
  children: React.ReactNode;
  params: usernameType;
}

const ConversationsLayout = async ({
  children,
  params,
}: ConversationsLayoutProps) => {
  const currentUser = await getCurrentUser();

  // prevents to check other users conversations
  if (currentUser?.username !== params.username) {
    redirect(`/user/${currentUser?.username}/conversations`);
  }

  return <div>{children}</div>;
};

export default ConversationsLayout;
