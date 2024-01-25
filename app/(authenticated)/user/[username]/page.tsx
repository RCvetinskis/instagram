import { getUserByUsername } from "@/lib/user-service";
import { Header, HeaderSkeleton } from "./_components/header";
import { getUserPosts } from "@/actions/posts-actions";
import { Separator } from "@/components/ui/separator";
import { UserPosts, UserPostsSkeleton } from "./_components/user-posts";
import { Suspense } from "react";

interface UserPageProps {
  username: string;
}
const UserPage = async ({ params }: { params: UserPageProps }) => {
  const user = await getUserByUsername(params.username);
  const posts = await getUserPosts(user.id);

  return (
    <main>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header user={user} postsLength={posts.length} />
      </Suspense>

      <Separator className="my-5" />
      <Suspense fallback={<UserPostsSkeleton />}>
        <UserPosts posts={posts} />
      </Suspense>
    </main>
  );
};

export default UserPage;
