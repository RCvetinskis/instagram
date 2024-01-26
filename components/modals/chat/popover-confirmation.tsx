import { onConversationDelete } from "@/actions/conversation-actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Conversation } from "@prisma/client";
import { useTheme } from "next-themes";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface PopoverConfirmationProps {
  conversation: Conversation;
}
export const PopoverConfirmation = ({
  conversation,
}: PopoverConfirmationProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const [isPending, startTransition] = useTransition();

  const onLeave = () => {
    startTransition(() => {
      onConversationDelete(conversation.id)
        .then(() => toast.success("Succesfully deleted the conversation"))
        .catch((error) => toast.error(error.message));
    });
  };

  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full" variant="shadow">
          Delete Chat
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("rounded border-none shadow-3xl", dialogContentStyle)}
      >
        <header className="my-2 text-red-500 text-sm font-bold">
          <h2>Are you sure you want to delete this conversation?</h2>
        </header>
        <div className="flex justify-between items-center">
          <Button
            disabled={isPending}
            size={"sm"}
            variant="shadow"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onLeave}
            size={"sm"}
            variant="shadow"
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
