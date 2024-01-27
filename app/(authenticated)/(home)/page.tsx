import { Posts } from "../_components/posts/posts";

import { getPostsFollowing } from "@/actions/posts-actions";

const HomePage = async () => {
  const allPosts = await getPostsFollowing(1);

  return (
    <main>
      <Posts
        initialPosts={allPosts}
        noPostsText="Follow someone to see posts"
        variant="home"
      />
    </main>
  );
};

export default HomePage;
