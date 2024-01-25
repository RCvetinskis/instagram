"use client";

import * as z from "zod";

export const formUploadSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required",
    })
    .max(50),
  description: z.string(),
});

export const commentFormSchema = z.object({
  comment: z.string().min(1),
});

export const messageFormSchema = z.object({
  message: z.string().min(1, {
    message: "Message required",
  }),
  file: z
    .union([
      z.instanceof(File).refine((value) => value instanceof File, {
        message: "File required",
      }),
      z.instanceof(Blob).refine((value) => value instanceof Blob, {
        message: "File required",
      }),
    ])
    .refine((value) => value !== undefined && value !== null, {
      message: "Either message or file is required",
    }),
  senderId: z.string().min(1, { message: "User id not provided" }),
  conversationId: z
    .string()
    .min(1, { message: "Conversation id not provided" }),
});
