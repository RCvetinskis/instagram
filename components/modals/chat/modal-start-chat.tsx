"use client";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { User } from "@prisma/client";
import { Input } from "../../ui/input";
import { XCircle } from "lucide-react";
import { getUsersQuery } from "@/actions/user-actions";
import { toast } from "sonner";
import { UserAvatar } from "../../user/user-avatar";
import { PopoverGroupChat } from "./popover-group-chat";
import { onCreateConversation } from "@/actions/conversation-actions";
import { CreateConversationType } from "@/types";
import { useRouter } from "next/navigation";
import { find } from "lodash";

interface ModalStartChatProps {
  children: React.ReactNode;
}
export const ModalStartChat = ({ children }: ModalStartChatProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [users, setUsers] = useState<User[] | []>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[] | []>([]);
  const [groupName, setGroupName] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const onChange = () => {
    if (!inputValue || inputValue.length === 0) return;

    getUsersQuery(inputValue)
      .then((res) => {
        setUsers(res);
      })
      .catch((error) => toast.error(error.message));
  };

  const memoizedUsers = useMemo(() => users, [users]);

  const onClear = () => {
    setInputValue("");
    setUsers([]);
  };

  const selectUser = (user: User) => {
    setSelectedUsers((prev) => {
      if (find(prev, { id: user.id })) return prev;
      return [...prev, user];
    });
  };
  const clearSelectedUser = (userId: string) => {
    setSelectedUsers((prev) => {
      const updated = prev.filter((user) => user.id !== userId);
      return updated;
    });
  };

  useEffect(() => {
    setGroupName("");
  }, [selectedUsers]);

  const startConversation = () => {
    const props: CreateConversationType = {
      userId: selectedUsers[0].id,
      isGroup: selectedUsers.length > 1,
      members: selectedUsers.map((user) => ({
        userId: user.id,
      })),
      name: groupName,
    };
    startTransition(() => {
      onCreateConversation(props)
        .then((res) => {
          router.push(
            `/user/${res?.currentUsername}/conversations/${res?.conversationId}`
          );
          setOpen(false);
        })
        .catch((error) => {
          setGroupName("");
          setSelectedUsers([]);
          toast.error(error.message);
        });
    });
  };

  const { theme } = useTheme();
  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn("border-none  shadow-3xl", dialogContentStyle)}
      >
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="group relative">
          <Input
            className="w-full rounded  pr-8  border-none outline-none shadow-3xl "
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

        {selectedUsers.length > 0 && (
          <div className="h-[25vh]  overflow-y-auto">
            <p className="text-sm">Selected</p>
            {groupName.length > 0 && (
              <p className="text-sm capitalize">Name {groupName}</p>
            )}
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 p-2 rounded cursor-pointer my-1  bg-sky-700"
              >
                <UserAvatar user={user} />
                <p>{user.username}</p>
                <XCircle
                  className="cursor-pointer hover:text-gray-500  ml-auto transition-all"
                  size={18}
                  onClick={() => clearSelectedUser(user.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 py-4 mt-2 h-[30vh]  overflow-y-auto">
          <p className="text-sm">Results</p>
          {memoizedUsers.length > 0 ? (
            memoizedUsers.map((user) => (
              <div
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-sky-700"
                key={user.id}
                onClick={() => selectUser(user)}
              >
                <UserAvatar user={user} />
                <p>{user.username}</p>
              </div>
            ))
          ) : (
            <p className="text-sm">No accounts found</p>
          )}
        </div>

        <DialogFooter>
          {selectedUsers.length > 1 && !groupName ? (
            <PopoverGroupChat setGroupName={setGroupName} />
          ) : (
            <Button
              disabled={selectedUsers.length === 0 || isPending}
              variant="primary"
              className="w-full rounded"
              onClick={startConversation}
            >
              Chat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
