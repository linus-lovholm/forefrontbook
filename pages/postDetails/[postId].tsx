import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Post from "../../components/post";
import { usePostQuery } from "../../__generated__/lib/post.graphql";
import { LoadingSpinner } from "../../components/loading-spinner";
import { Box } from "@chakra-ui/layout";

export default function postDetails() {
  const router = useRouter();
  const { postId } = router.query;
  const { data, loading, error } = usePostQuery({
    variables: { id: postId as string },
  });
  const post = data?.post[0];
  if (loading) {
    return (
      <Box p={8} display={{ md: "flex" }}>
        <LoadingSpinner />
      </Box>
    );
  } else {
    return (
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>
        <p>this da id = {postId}</p>
        <Post showingDetailPage={true} key={post.id} post={post} />
      </div>
    );
  }
}
