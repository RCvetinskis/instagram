"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserConversationProps } from "@/types";
import { User } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useTransition } from "react";
import { PopoverConfirmation } from "./popover-confirmation";
import { onUpdateConversationName } from "@/actions/conversation-actions";
import { toast } from "sonner";

interface ModalConversationSettingsProps {
  conversation: UserConversationProps;
  otherUser: User;
}

export const ModalConversationSettings = ({
  conversation,
  otherUser,
}: ModalConversationSettingsProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const onUpdateName = () => {
    if (!conversation.isGroup && inputValue.length === 0) return;
    onUpdateConversationName(conversation.id, inputValue)
      .then((res) =>
        toast.success(`Group name has been changed to ${res.name}`)
      )
      .catch((error) => toast.error(error.message));
  };

  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="hover:text-gray-500 transition">
          <MoreHorizontal />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(" border-none shadow-3xl", dialogContentStyle)}
      >
        <DialogHeader>
          <DialogTitle>
            <p>Conversation Settings</p>
            <p className="capitalize">
              {conversation.isGroup ? conversation.name : otherUser.username}
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {conversation.isGroup && (
            <div className="flex items-center gap-3">
              <Input
                className="border-none outline-none shadow-3xl rounded"
                placeholder="Group name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isPending}
              />
              <Button
                onClick={onUpdateName}
                disabled={isPending}
                variant="shadow"
              >
                Change
              </Button>
            </div>
          )}
          <PopoverConfirmation conversation={conversation} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
