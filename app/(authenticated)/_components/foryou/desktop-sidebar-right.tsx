import { NavItemForyou } from "./nav-item-foryou";
export const DesktopRightSidebar = () => {
  return (
    <aside>
      <aside className="hidden md:block md:fixed md:w-[150px] lg:w-[200px] top-0 left-0 h-full border-r border-gray-700 py-8  ">
        <ul
          role="list"
          className="flex flex-col items-center justify-between h-full"
        >
          <h1 className="text-3xl  font-serif my-6">Instagram</h1>
          {/* {routes.map((item) => (
            <NavItemForyou
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
              side="right"
            />
          ))} */}
        </ul>
      </aside>
    </aside>
  );
};
