"use client";
import { Button } from "@/components/ui/button";

import { useClerk } from "@clerk/nextjs";

export const EditProfile = () => {
  const { openUserProfile } = useClerk();

  const handleClick = () => {
    openUserProfile();
  };

  return (
    <Button onClick={handleClick} variant={"shadow"}>
      Edit Profile
    </Button>
  );
};
