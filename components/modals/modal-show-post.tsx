"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { PostInfo } from "@/app/(authenticated)/_components/posts/post-info";
import { Slider } from "../slider";

import { UserCommentsExtentedPost } from "@/types";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
interface ModalShowPostProps {
  post: UserCommentsExtentedPost;
  children: React.ReactNode;
}

export const ModalShowPost = ({ post, children }: ModalShowPostProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { theme } = useTheme();

  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown shadow-stone-900";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent
          className={cn(
            "max-w-[1200px] h-[96vh] border-none shadow-3xl flex items-center justify-center",
            dialogContentStyle
          )}
        >
          <div className="flex-1">
            <Slider files={post.files} prevArrow="left-7" nextArrow="right-7" />
          </div>
          <div className="flex-1 w-full h-full">
            <PostInfo post={post} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent
        className={cn("border-none shadow-3xl", dialogContentStyle)}
      >
        <DrawerClose asChild className="relative">
          <Button
            className="absolute right-0 hover:text-gray-500"
            variant={"ghost"}
          >
            <X size={16} />
          </Button>
        </DrawerClose>

        <div className="h-[85vh]">
          <PostInfo post={post} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
