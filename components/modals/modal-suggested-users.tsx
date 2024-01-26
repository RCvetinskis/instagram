"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { useTheme } from "next-themes";
import { User } from "@prisma/client";
import { UserLabel } from "../user/user-label";

interface ModalSuggestedUsersProps {
  children: React.ReactNode;
  suggestedUsers: User[];
}
export const ModalSuggestedUsers = ({
  children,
  suggestedUsers,
}: ModalSuggestedUsersProps) => {
  const [open, setOpen] = useState(false);

  const { theme } = useTheme();

  const dialogContentStyle = theme === "light" ? "bg-white" : " bg-customBrown";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className={cn(" border-none shadow-3xl ", dialogContentStyle)}
      >
        <DialogHeader>
          <DialogTitle className="text-gray-500">Suggested for you</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start pl-2 py-1 gap-3 max-h-[300px] overflow-y-auto">
          {suggestedUsers.length === 0 && (
            <p className="text-gray-500 text-sm">No new users found</p>
          )}
          {suggestedUsers.map((user) => (
            <UserLabel
              key={user.id}
              user={user}
              href={`/user/${user.username}`}
              side="bottom"
              align="center"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
