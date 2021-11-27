import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { AddCommentMutation, useAddCommentMutation } from "../lib/post.graphql";

const CreateComment = ({ post }) => {
  const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
    refetchQueries: ["Post"],
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const content = event.currentTarget.elements.content;
    await addCommentMutation({
      variables: {
        postId: post.id,
        content: content.value,
      },
    });
    content.value = "";
  }

  return (
    <Box display={"flex"}>
      <form onSubmit={handleSubmit}>
        <Input maxW="800" type="text" name="content" />
        <Button marginTop={4} type="submit">
          Add Comment
        </Button>
      </form>
    </Box>
  );
};

export default CreateComment;

