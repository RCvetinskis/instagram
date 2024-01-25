"use client";
import * as z from "zod";
import { commentFormSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useTransition } from "react";
import { onCreateComment } from "@/actions/comment-actions";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  postId: string;
}
export const CommentForm = ({ postId }: CommentFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit(values: z.infer<typeof commentFormSchema>) {
    startTransition(() => {
      form.setValue("comment", "", { shouldValidate: true });
      onCreateComment(postId, values.comment).catch((error) =>
        toast.error(error.message)
      );
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-[4fr,0fr] gap-3 items-center my-2"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled={isPending}
                  placeholder="Add a comment..."
                  className={cn(
                    "resize-none min-h-0 shadow-4xl   border-none outline-none rounded",
                    theme !== "light" && " shadow-gray-500"
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" variant={"ghost"}>
          <SendHorizonal />
        </Button>
      </form>
    </Form>
  );
};
