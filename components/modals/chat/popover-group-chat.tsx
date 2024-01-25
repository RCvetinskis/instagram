"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

interface PopoverGroupChatProps {
  setGroupName: (groupName: string) => void;
}
export const PopoverGroupChat = ({ setGroupName }: PopoverGroupChatProps) => {
  const [inputValue, setInputValue] = useState("");
  const { theme } = useTheme();

  const handleClick = () => {
    if (inputValue.length < 2) toast.error("Group name is to short");
    setGroupName(inputValue);
  };
  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown ";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="primary" className="w-full rounded">
          Next
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(" shadow-3xl  min-w-[400px]", dialogContentStyle)}
      >
        <div className="flex flex-col gap-5 ">
          <div>
            <Label>Group name</Label>
            <Input
              placeholder="Group name..."
              className="w-full rounded  pr-8 my-2 border-none outline-none shadow-3xl "
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <Button
            onClick={handleClick}
            variant="primary"
            className="w-full rounded"
          >
            Set name
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
