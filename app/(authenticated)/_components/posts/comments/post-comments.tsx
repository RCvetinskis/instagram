import { SingleComment } from "./single-comment";
import { UserExtendedComment } from "@/types";

interface PostCommentProps {
  comments: UserExtendedComment[];
}

export const PostComments = ({ comments }: PostCommentProps) => {
  return (
    <>
      {comments.map((comment) => (
        <SingleComment key={comment.id} comment={comment} />
      ))}
    </>
  );
};
