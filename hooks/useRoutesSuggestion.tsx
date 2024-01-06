"use client";

import { getSuggestedUsers } from "@/lib/user-service";
import { useMemo } from "react";

const useRoutesSuggestion = async () => {
  const suggestedUsers = await getSuggestedUsers();

  const routes = useMemo(() => {
    return suggestedUsers?.map((user) => ({
      href: `/user/${user.id}`,
      label: user.username,
      avatarUrl: user.avatar,
    }));
  }, [suggestedUsers]);
  return routes || [];
};

export default useRoutesSuggestion;
