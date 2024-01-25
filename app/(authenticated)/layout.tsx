import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "./_components/navigation/desktop-sidebar";
import { MobileFooter } from "./_components/navigation/mobile-fooder";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="hidden md:block lg:w-1/6 h-full ">
        <DesktopSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto md:container">{children}</div>

      {/* Footer */}
      <MobileFooter />
    </div>
  );
};

export default MainLayout;
