import { usePostQuery } from "../lib/post.graphql";
import { Button } from "@chakra-ui/button";

import Post from "./post";
import { useState } from "react";
const TAKE = 5;

const Feed = () => {
  const [sortOrder, setSortOrder] = useState("date");
  const [skip, setSkip] = useState(0);
  const { data, loading, error } = usePostQuery({
    variables: { sortOrder, skip, take: TAKE + 1 },
    notifyOnNetworkStatusChange: false,
  });

  const posts = data?.post;
  if (error) {
    return <p></p>;
  }
  if (posts) {
    return (
      <div>
        {sortOrder === "popularity" ? (
          <Button type="button" onClick={() => setSortOrder("date")}>
            Order by Date
          </Button>
        ) : (
          <Button type="button" onClick={() => setSortOrder("popularity")}>
            Order by Popularity
          </Button>
        )}
        {posts.map(
          (post, index) => index < TAKE && <Post key={post.id} post={post} />
        )}
        {skip > 0 && (
          <Button type="button" onClick={() => setSkip(skip - TAKE)}>
            Previous Page
          </Button>
        )}
        {posts.length > TAKE && (
          <Button type="button" onClick={() => setSkip(skip + TAKE)}>
            Next Page
          </Button>
        )}
      </div>
    );
  }
  return <div>loading</div>;
};

export default Feed;
