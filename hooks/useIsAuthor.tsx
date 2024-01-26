"use client";

import { getIsUserAuthor } from "@/actions/posts-actions";
import { useEffect, useState } from "react";

const useIsAuthor = (postId: string) => {
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const getAuthor = async () => {
      const author = await getIsUserAuthor(postId);
      setIsAuthor(author);
    };

    getAuthor();
  }, [postId]);

  return isAuthor;
};

export default useIsAuthor;
