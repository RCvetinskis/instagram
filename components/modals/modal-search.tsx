"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useMediaQuery from "@/hooks/useMediaQuery";

import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Search, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { getUsersQuery } from "@/actions/user-actions";
import { toast } from "sonner";
import { UserLabel } from "../user/user-label";
export function ModalSearch() {
  const { theme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<User[] | []>([]);

  const onChange = () => {
    if (!inputValue || inputValue.length === 0) return;

    getUsersQuery(inputValue)
      .then((res) => {
        setUsers(res);

        const limitedRecentUsers = res.slice(0, 5);

        localStorage.setItem(
          "recent-users",
          JSON.stringify(limitedRecentUsers)
        );
      })
      .catch((error) => toast.error(error.message));
  };

  const memoizedUsers = useMemo(() => users, [users]);
  const recentUsers = JSON.parse(localStorage.getItem("recent-users") || "[]");
  const onClear = () => {
    setInputValue("");
    setUsers([]);
  };

  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Search />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isDesktop ? "left" : "top"}
        className={cn("shadow-3xl", dialogContentStyle)}
      >
        <SheetHeader className="py-4">
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>Search InstaClone Users</SheetDescription>
        </SheetHeader>

        <div className="group relative">
          <Input
            className="w-full rounded  pr-8  border-none outline-none shadow-3xl"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange();
            }}
          />
          {inputValue.length > 0 && (
            <XCircle
              className="absolute top-3 right-2 cursor-pointer hover:text-gray-500 transition-all"
              size={18}
              onClick={onClear}
            />
          )}
        </div>

        <div className="flex flex-col gap-3 py-4 mt-2 h-[30vh]  overflow-y-auto">
          {memoizedUsers.length > 0 ? (
            memoizedUsers.map((user) => (
              <UserLabel
                key={user.id}
                user={user}
                href={`/user/${user.username}`}
              />
            ))
          ) : (
            <div className="flex flex-col gap-3">
              <h3 className="my-2">Recent search:</h3>
              {recentUsers.map((user: any) => (
                <UserLabel
                  key={user.id}
                  user={user}
                  href={`/user/${user.username}`}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
