import { LoadMore } from "@/app/(authenticated)/_components/posts/load-more-posts";
import { Posts } from "../_components/posts/posts";

import { getExplorePosts } from "@/actions/posts-actions";

const ExplorePage = async () => {
  const allPosts = await getExplorePosts(1);

  return (
    <main>
      <Posts
        initialPosts={allPosts}
        noPostsText="No new posts from unfollowed users"
      />

      <LoadMore variant="explore" />
    </main>
  );
};

export default ExplorePage;
