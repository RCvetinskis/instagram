import { setUserOnline } from "@/actions/user-actions";
import { DesktopSidebar } from "./_components/navigation/desktop-sidebar";
import { MobileFooter } from "./_components/navigation/mobile-fooder";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  await setUserOnline();
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
