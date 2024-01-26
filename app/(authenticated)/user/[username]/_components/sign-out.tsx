"use client";
import { setUserOffline } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const SignOut = () => {
  const { signOut } = useClerk();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleClick = async () => {
    startTransition(() => {
      setUserOffline()
        .then(() => {
          signOut().then(() => router.push("/sign-in"));
        })
        .catch((error) => toast(error.message));
    });
  };
  return (
    <Button disabled={isPending} onClick={handleClick} variant={"shadow"}>
      Sign Out
    </Button>
  );
};
