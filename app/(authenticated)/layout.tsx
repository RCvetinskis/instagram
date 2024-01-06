import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "./_components/navigation/desktop-sidebar";
import { MobileFooter } from "./_components/navigation/mobile-fooder";
import { DesktopRightSidebar } from "./_components/foryou/desktop-sidebar-right";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div className="h-full">
      <DesktopSidebar />
      <MobileFooter />
      <DesktopRightSidebar />
      <div className="md:pl-[150px] lg:pl-[200px]  md:container pt-5">
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
