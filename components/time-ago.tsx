import { format, formatDistanceToNow } from "date-fns";

import { enUS } from "date-fns/locale";
import { HoverLabel } from "./hover-label";
import { Skeleton } from "./ui/skeleton";

interface TimeAgoProps {
  createdAt: Date;
}

export const TimeAgo = ({ createdAt }: TimeAgoProps) => {
  const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: enUS,
  });
  return (
    <HoverLabel
      asChild
      label={format(new Date(createdAt), "MMM d, yyyy")}
      side="top"
      align="center"
    >
      <p className="text-xs  text-gray-500 cursor-pointer">{timeAgo}</p>
    </HoverLabel>
  );
};

export const TimeAgoSkeleton = () => {
  return <Skeleton className="bg-gray-500 w-[100px] h-[20px]" />;
};
