"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { onDeletePost } from "@/actions/posts-actions";
import { toast } from "sonner";

interface ModalDeletePostProps {
  postId: string;
}

export const ModalDeletePost = ({ postId }: ModalDeletePostProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(() => {
      onDeletePost(postId)
        .then((res) =>
          toast.success(`Post ${res.title.toUpperCase()} succesfully deleted!`)
        )
        .catch((error) => toast.error(error.message));
    });
  };

  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "hover:text-gray-500 transition",
            open && "text-gray-500"
          )}
        >
          <Trash2 size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("rounded border-none shadow-3xl", dialogContentStyle)}
      >
        <header className="my-2">
          <h2 className="text-red-500 text-sm font-bold">
            Are you sure you want to delete this post?
          </h2>
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
            onClick={onDelete}
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
