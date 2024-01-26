import { DesktopSidebar } from "./_components/navigation/desktop-sidebar";
import { MobileFooter } from "./_components/navigation/mobile-fooder";
// TODO: figure out how to display online and offline users
const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
