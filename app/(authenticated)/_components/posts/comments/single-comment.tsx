import { TimeAgo } from "@/components/time-ago";

import { UserLabel } from "@/components/user/user-label";
import { UserExtendedComment } from "@/types";

interface SingleCommentProps {
  comment: UserExtendedComment;
}
export const SingleComment = ({ comment }: SingleCommentProps) => {
  return (
    <div className="py-1">
      <div className="text-xs">
        <UserLabel
          user={comment.author}
          href={`/user/${comment.author.username}`}
          side="bottom"
          align="center"
        />
        <div className="p-1">{comment.comment}</div>
      </div>

      <div className="text-gray-500 text-xs flex gap-2 items-center ">
        <TimeAgo createdAt={comment.createdAt} />
      </div>
    </div>
  );
};
