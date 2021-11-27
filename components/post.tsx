import { Box, Container, HStack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { AddLikeMutation, useAddLikeMutation } from "../lib/post.graphql";

import Image from "next/image";
import React, { useEffect } from "react";
import { useSession } from "next-auth/client";
import CreateComment from "./create-comment";
import Link from "next/link";

const Post = ({ post, showingDetailPage = false }) => {
  console.log("Post", post);
  const [addLikeMutation, { data, loading, error }] = useAddLikeMutation({
    refetchQueries: ["Post"],
  });
  const [session] = useSession();
  useEffect(() => {
    console.log(data);
  }, [data]);

  async function handleSubmitLike(event) {
    event.preventDefault();

    await addLikeMutation({
      variables: {
        postId: post.id,
      },
    });
  }

  async function handleSubmitUnlike(event) {
    event.preventDefault();

    await addLikeMutation({
      variables: {
        postId: post.id,
        doUnlike: true,
      },
    });
  }
  return (
    <Container maxW={"500px"} border={"1px solid white"} m={1} p={2}>
      <HStack>
        <Box minW={100} className="post-header">
          {!showingDetailPage && (
            <Link
              href={{
                pathname: `/postDetails/[postId]`,
                query: { postId: post.id },
              }}
            >
              <a>
                <h4>Go To Post</h4>
              </a>
            </Link>
          )}

          <HStack>
            {post.author?.image && (
              <img
                alt={post.author?.name}
                src={post.author?.image}
                width={50}
                height={50}
              />
            )}
            <Text>{post.author?.name}</Text>
            <Text>
              {new Date(parseInt(post.createdAt)).toLocaleDateString()}
            </Text>
            <div>
              <Text>Likes: {post.likes?.length ?? 0}</Text>
              {post.likes?.filter(
                (like) => like.author.email !== session?.user?.email
              ).length === 0 ? (
                <Button marginTop={4} type="button" onClick={handleSubmitLike}>
                  Like
                </Button>
              ) : (
                <Button
                  marginTop={4}
                  type="button"
                  onClick={handleSubmitUnlike}
                >
                  Unlike
                </Button>
              )}
            </div>
            <div>
              Comments:
              <CreateComment post={post} />
              <div>
                {post.comments
                  ?.map((comment) => (
                    <Text>
                      {comment.content} - {comment.author.name}
                    </Text>
                  ))
                  .reverse()}
              </div>
            </div>
          </HStack>
        </Box>
        <Box className="post-body">{post.content}</Box>
      </HStack>
    </Container>
  );
};

export default Post;
