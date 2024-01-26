"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner } from "../../../../components/loading/spinner";
import { getExplorePosts, getPostsFollowing } from "@/actions/posts-actions";
import { Posts } from "@/app/(authenticated)/_components/posts/posts";
import { UserCommentsExtentedPost } from "@/types";

interface LoadMoreProps {
  variant: "home" | "explore";
}
export const LoadMore = ({ variant }: LoadMoreProps) => {
  const [data, setData] = useState<UserCommentsExtentedPost[]>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const { ref, inView } = useInView();

  const loadMoreData = async () => {
    const nextPage = pagesLoaded + 1;

    const newData =
      variant === "home"
        ? (await getPostsFollowing(nextPage)) ?? []
        : (await getExplorePosts(nextPage)) ?? [];

    if (newData.length === 0) {
      setHasMoreData(false);
    } else {
      setData((prevData: UserCommentsExtentedPost[]) => [
        ...prevData,
        ...newData,
      ]);
    }

    setPagesLoaded(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMoreData();
    }
  }, [inView]);

  return (
    <>
      <Posts initialPosts={data} noPostsText="" />
      {hasMoreData && (
        <div ref={ref} className="flex justify-center items-center p-1 w-full">
          <Spinner />
        </div>
      )}
    </>
  );
};
