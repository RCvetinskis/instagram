"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { messageFormSchema } from "@/schemas/schemas";
import { Image as ImageIconDefault, SendHorizontal } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { onSendMessage } from "@/actions/message-actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface SendMessageProps {
  conversationId: string;
  currentUserId: string;
}

export const SendMessage = ({
  conversationId,
  currentUserId,
}: SendMessageProps) => {
  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      message: "",
      file: null!,
      senderId: currentUserId,
      conversationId: conversationId,
    },
  });

  const [fileDisplay, setFileDisplay] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof messageFormSchema>) => {
    const formData = new FormData();

    if (values.file) formData.append("file", values.file);

    formData.append("message", values.message);
    formData.append("senderId", values.senderId);
    formData.append("conversationId", values.conversationId);

    startTransition(() => {
      onSendMessage(formData)
        .catch((error) => {
          toast.error(error.message);
          resetForm();
        })
        .finally(() => {
          resetForm();
        });
    });
    resetForm();
  };

  const resetForm = () => {
    form.reset();

    setFileDisplay(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      form.setValue("file", file);

      const reader = new FileReader();
      reader.onload = () => {
        setFileDisplay(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    form.setValue("file", null!);
    setFileDisplay(null);
  };

  const sendHeart = () => {
    form.setValue("message", "❤️");
    onSubmit(form.getValues());
  };

  const sendMessage = () => {
    onSubmit(form.getValues());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isPending}
                  placeholder="Message..."
                  className={cn(
                    "rounded-xl border-none shadow-3xl  shadow-black/75 focus:shadow-black  outline-none p-2 pr-10 resize-none min-h-12",
                    fileDisplay && "min-h-24 pt-16"
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("message")?.length === 0 && !fileDisplay ? (
          <div
            className={cn(
              "flex items-center gap-1 absolute top-2 right-4 ",
              fileDisplay && "top-12"
            )}
          >
            <Label
              htmlFor="fileInput"
              className="cursor-pointer hover:text-gray-500 p-1 transition"
            >
              <ImageIconDefault />
            </Label>
            <Input
              disabled={isPending}
              type="file"
              accept="image/*,video/*"
              id="fileInput"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
            />

            <Button
              disabled={isPending}
              type="button"
              variant={"ghost"}
              className="group p-1 transition-transform hover:scale-95"
              onClick={sendHeart}
            >
              <Heart className="text-red-400 group-hover:fill-red-400 transition-all" />
            </Button>
          </div>
        ) : (
          <Button
            disabled={isPending}
            type="button"
            variant={"ghost"}
            className={cn(
              "absolute top-2 right-4 hover:text-gray-500",
              fileDisplay && "top-12"
            )}
            onClick={sendMessage}
          >
            <SendHorizontal />
          </Button>
        )}

        {/* Display file name or preview */}
        {fileDisplay && (
          <div className="absolute top-3 left-6">
            {fileDisplay.startsWith("data:image") ? (
              <img
                src={fileDisplay}
                alt="File Preview"
                className="max-h-10 max-w-full rounded"
              />
            ) : fileDisplay.startsWith("data:video") ? (
              <video
                src={fileDisplay}
                className="max-h-14  w-[100px] rounded"
                controls
              />
            ) : null}
            {/* Clear file button */}
            <Button
              type="button"
              onClick={clearFile}
              variant={"ghost"}
              className="absolute -top-5 -right-4 text-gray-500 hover:text-gray-700 cursor-pointer p-1"
            >
              <X size={16} className="border rounded-full border-gray-500" />
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export const SendMessageSkeleton = () => {
  return (
    <Skeleton className="rounded-xl shadow-3xl  shadow-black/75   p-2 pr-10 h-12 w-full bg-gray-500 " />
  );
};
