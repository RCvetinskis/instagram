"use client";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

export const SignOut = () => {
  const { signOut, redirectToSignUp } = useClerk();

  const handleClick = () => {
    signOut();
    redirectToSignUp();
  };
  return (
    <Button onClick={handleClick} variant={"shadow"}>
      Sign Out
    </Button>
  );
};
