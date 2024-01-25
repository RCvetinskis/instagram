"use client";

import { useState, useRef, useTransition } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { PlusSquare } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilesPreview } from "../filesPreview";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { onCreatePost } from "@/actions/posts-actions";
import { formUploadSchema } from "@/schemas/schemas";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../loading/loading-spinner";

export type FilePreviewType = {
  file: File;
  previewUrl: string;
};
export function CreatePostModal() {
  const [files, setFiles] = useState<FilePreviewType[]>([]);
  const { theme } = useTheme();

  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files || null;

    if (selectedFiles) {
      const fileObjects = Array.from(selectedFiles).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setFiles(fileObjects);
    }
  };

  const clearImage = (fileToRemove: string) => {
    setFiles((prevFile) =>
      prevFile.filter((file) => file.previewUrl !== fileToRemove)
    );
  };
  const form = useForm<z.infer<typeof formUploadSchema>>({
    resolver: zodResolver(formUploadSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const dialogRef = useRef<HTMLButtonElement | null>(null);
  const closeDialog = () => {
    dialogRef.current?.click();
  };
  const handleUpload = (values: z.infer<typeof formUploadSchema>) => {
    if (!files || files.length === 0) {
      toast.error("No image or video selected");
      return;
    }

    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file.file);
    }

    formData.append("title", values.title);
    formData.append("description", values.description);

    startTransition(() => {
      onCreatePost(formData)
        .then((res) => {
          closeDialog();
          toast.success(`Post ${res.title} succesfully added.`);
        })
        .catch((error) => toast.error(error.message))
        .finally(() => closeDialog());
    });
  };
  const dialogContentStyle =
    theme === "light" ? "bg-white" : " bg-customBrown shadow-stone-900";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <PlusSquare />
      </DialogTrigger>

      <DialogContent
        className={cn("border-none   shadow-3xl ", dialogContentStyle)}
      >
        {isPending && <LoadingSpinner />}
        <DialogHeader>
          <DialogTitle>Create new post </DialogTitle>
        </DialogHeader>

        {files.length > 0 && (
          <div className="rounded-xl max-w-[300px] mx-auto w-full">
            <FilesPreview files={files} onClear={clearImage} />
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpload)}
            className=" flex flex-col gap-5  "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="rounded border-none outline-none shadow-3xl"
                      placeholder="Title"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="rounded border-none resize-none outline-none shadow-3xl"
                      placeholder="Desciption"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded border-none outline-none shadow-3xl w-1/2 ">
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isPending}
                className="rounded border-none outline-none "
              />
            </div>

            <div className="flex justify-between items-center ">
              <DialogClose ref={dialogRef} asChild>
                <Button
                  type="button"
                  className=" hover:bg-gray-300 hover:text-black transition rounded shadow-3xl"
                  variant={"ghost"}
                  disabled={isPending}
                >
                  Close
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className=" hover:bg-gray-300 hover:text-black transition rounded shadow-3xl"
                variant={"ghost"}
                disabled={isPending}
              >
                Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
