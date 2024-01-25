import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const UserPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
};

export default UserPageLayout;
