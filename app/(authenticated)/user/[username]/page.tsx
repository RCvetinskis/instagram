import { getUserByUsername } from "@/lib/user-service";
import { Header, HeaderSkeleton } from "./_components/header";
import { getUserPosts } from "@/actions/posts-actions";
import { Separator } from "@/components/ui/separator";
import { UserPosts, UserPostsSkeleton } from "./_components/user-posts";

import { Skeleton } from "@/components/ui/skeleton";

interface UserPageProps {
  username: string;
}
const UserPage = async ({ params }: { params: UserPageProps }) => {
  const user = await getUserByUsername(params.username);
  const posts = await getUserPosts(user.id);

  return (
    <main>
      <Header user={user} postsLength={posts.length} />

      <Separator className="my-5" />

      <UserPosts posts={posts} />
    </main>
  );
};

export default UserPage;

export const UserPageSkeleton = () => {
  return (
    <main>
      <HeaderSkeleton />
      <Skeleton className="my-5" />
      <UserPostsSkeleton />
    </main>
  );
};
