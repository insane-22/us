"use client";

import useActiveList from "@/hooks/useActiveList";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { ChevronLeft, Ellipsis } from "lucide-react";
import Link from "next/link";
import { useMemo} from "react";
import UserAvatar from "../UserAvatar";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    return isActive ? "Active" : "Offline";
  }, [isActive]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 w-full flex border-b-[1px] dark:border-gray-700 sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            className="block text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition cursor-pointer"
            href="/chat"
          >
            <ChevronLeft size={32} />
          </Link>

          {/* {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : ( */}
          <UserAvatar user={otherUser} />
          {/* )} */}

          <div className="flex flex-col">
            <div className="text-black dark:text-white">
              {conversation.name || otherUser?.name || otherUser?.email}
            </div>
            <div className="text-sm font-light text-neutral-500 dark:text-neutral-400">
              {statusText}
            </div>
          </div>
        </div>

        <Link href={`/dashboard/user/${otherUser.username}`}>
          <Ellipsis
            className="text-cyan-500 dark:text-cyan-400 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-300 transition"
            size={32}
          />
        </Link>
      </div>
    </>
  );
};
export default Header;