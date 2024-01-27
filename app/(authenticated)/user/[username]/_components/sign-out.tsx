"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const SignOut = () => {
  const { signOut } = useClerk();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleClick = async () => {
    startTransition(() => {
      localStorage.removeItem("recent-users");
      signOut().then(() => router.push("/sign-in"));
    });
  };
  return (
    <Button disabled={isPending} onClick={handleClick} variant={"shadow"}>
      Sign Out
    </Button>
  );
};
