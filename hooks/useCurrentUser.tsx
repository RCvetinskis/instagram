"use client";

import { getCurrentUser } from "@/lib/user-service";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  return currentUser;
};

export default useCurrentUser;
