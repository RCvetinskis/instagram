import { UserAvatar } from "@/components/user/user-avatar";
import { User } from "@prisma/client";
import { getCurrentUser } from "@/lib/user-service";
import { format } from "date-fns";

import { EditProfile } from "./edit-profile";
import { FollowUser } from "@/components/user/follow-user";
import {
  getFollowers,
  getFollowingUsers,
  isFollowing,
} from "@/lib/follow-service";
import { ModalFollowingUsers } from "@/components/modals/modal-following-users";
import { ModalFollowers } from "@/components/modals/modal-followers";
import { SignOut } from "./sign-out";
import { Skeleton } from "@/components/ui/skeleton";
interface HeaderProps {
  user: User;
  postsLength: number;
}
export const Header = async ({ user, postsLength }: HeaderProps) => {
  const currentUser = await getCurrentUser();
  const isCurrentUser = currentUser?.id === user.id;

  const isUserFollowing = await isFollowing(user.id);

  const followers = await getFollowers(user.id);

  const followingUsers = await getFollowingUsers(user.id);
  return (
    <header className="flex items-center justify-center gap-3 md:gap-11 rounded shadow-4xl py-4 shadow-black ">
      <div>
        <UserAvatar
          user={user}
          className=" w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px]  "
        />
      </div>
      <div>
        <div className="md:flex gap-4  items-center ">
          <h1 className="capitalize font-bold text-3xl">{user.username}</h1>
          {isCurrentUser ? (
            <>
              <EditProfile />
              <SignOut />
            </>
          ) : (
            <FollowUser userId={user.id} isUserFollowing={isUserFollowing} />
          )}
        </div>

        <ul className="flex items-center gap-3 mt-4">
          <li>{postsLength} posts</li>
          <ModalFollowers followers={followers}>
            <li className="hover:text-gray-500 h-6 hover:border-b border-gray-500 transition-all">
              {followers.length} followers
            </li>
          </ModalFollowers>

          <ModalFollowingUsers followingUsers={followingUsers}>
            <li className="hover:text-gray-500 h-6 hover:border-b border-gray-500 transition-all">
              {followingUsers.length} following
            </li>
          </ModalFollowingUsers>
        </ul>

        <div>
          <p className="my-2">{user.email}</p>
          <div>
            <span>Joined </span>
            {format(new Date(user.createdAt), "MMM d, yyyy")}
          </div>
        </div>
      </div>
    </header>
  );
};

export const HeaderSkeleton = () => {
  return (
    <header className="flex items-center justify-center gap-3 md:gap-11 rounded shadow-4xl py-4 shadow-black ">
      <div>
        <Skeleton className=" w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-gray-500 rounded-full " />
      </div>

      <div>
        <div className="md:flex gap-4   items-center ">
          <Skeleton className="w-[100px h-[20px] bg-gray-500 " />

          <div className="flex items-center gap-4">
            <Skeleton className="w-[200px] h-[50px] rounded py-2 px-1 bg-gray-500 " />
          </div>
        </div>
        <ul className="flex items-center gap-3 mt-4 bg-gray-500 ">
          <Skeleton className="w-[100px h-[20px] bg-gray-500 " />
          <Skeleton className="w-[100px h-[20px] bg-gray-500 " />
          <Skeleton className="w-[100px h-[20px] bg-gray-500 " />
        </ul>
        <div>
          <Skeleton className="w-[100px h-[20px] my-2 bg-gray-500 " />
          <div>
            <Skeleton className="w-[100px h-[20px] bg-gray-500  " />
            <Skeleton className="w-[120px h-[20px] bg-gray-500  " />
          </div>
        </div>
      </div>
    </header>
  );
};
