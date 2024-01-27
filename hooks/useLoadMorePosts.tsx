"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { getExplorePosts, getPostsFollowing } from "@/actions/posts-actions";

import { UserCommentsExtentedPost } from "@/types";

const useLoadMorePosts = (
  variant: string,
  initialPosts: UserCommentsExtentedPost[]
) => {
  const [data, setData] = useState(initialPosts);
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
      setData((prevData) => [...prevData, ...newData]);
    }

    setPagesLoaded(nextPage);
  };

  useEffect(() => {
    if (inView && hasMoreData) {
      loadMoreData();
    }
  }, [inView, hasMoreData]);

  return { data, setData, hasMoreData, ref };
};

export default useLoadMorePosts;
