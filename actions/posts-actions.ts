"use server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/user-service";
import { utapi } from "@/lib/uploadthing";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

export const onCreatePost = async (formData: FormData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("Unauthorized");
    if (!formData) throw new Error("No data provided.");

    const files = formData.getAll("files");
    const title = formData.get("title");
    const description = formData.get("description");

    if (!title) throw new Error("Title is missing");

    if (!files) throw new Error("File is required");

    const uploadedFile = await utapi.uploadFiles(files);

    if (!uploadedFile) throw new Error("Error uploading file");
    if (uploadedFile[0].error) throw new Error("Error uploading file");

    const newPost = await db.post.create({
      data: {
        title: title as string,
        description: description as string,
        files: uploadedFile.map((file) => file.data?.url) as string[],
        authorId: currentUser.id,
      },
    });

    revalidatePath("/");
    return newPost;
  } catch (error) {
    console.log("ERROR_ACTION CREATE_POST");
    throw error;
  }
};

export const getPostsFollowing = async (page: number) => {
  const { userId } = auth();
  if (!userId) return [];
  const currentUser = await db.user.findUnique({
    where: {
      externalUserId: userId,
    },
    include: {
      following: true,
    },
  });

  if (!currentUser) return [];

  const followedUserIDs = currentUser.following.map(
    (follow) => follow.followingId
  );

  const take = 2;
  const skip = (page - 1) * take;

  const posts = await db.post.findMany({
    where: {
      authorId: {
        in: [...followedUserIDs, currentUser.id],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    skip,
    take,
  });

  if (!posts) return [];
  revalidatePath("/");
  return posts;
};

export const getExplorePosts = async (page: number) => {
  const { userId } = auth();
  if (!userId) return [];
  const currentUser = await db.user.findUnique({
    where: {
      externalUserId: userId,
    },
    include: {
      following: true,
    },
  });

  if (!currentUser) return [];

  const followedUserIDs = currentUser.following.map(
    (follow) => follow.followingId
  );

  const take = 2;
  const skip = (page - 1) * take;

  const posts = await db.post.findMany({
    where: {
      NOT: {
        authorId: {
          in: [...followedUserIDs, currentUser.id],
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    skip,
    take,
  });

  if (!posts) return [];
  revalidatePath("/explore");
  return posts;
};
export const getUserPosts = async (authorId: string) => {
  const posts = await db.post.findMany({
    where: {
      authorId,
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  if (!posts) return [];
  return posts;
};

export const getUserFirstPosts = async (authorId: string) => {
  const posts = await db.post.findMany({
    where: {
      authorId,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalPostsCount = await db.post.count({
    where: {
      authorId,
    },
  });

  return {
    posts,
    totalPostsCount,
  };
};
