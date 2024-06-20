import Link from "next/link";
import MoreDropdown from "../MoreDropdown";
import { buttonVariants } from "../ui/button";
import { Handshake } from "lucide-react";
import { FullConversationType } from "@/types/db";
import { User } from "@prisma/client";
import ConversationList from "./ConversationList";

interface ConversationListProps {
  initialConversations: FullConversationType[];
  users: User[];
}

export default async function Sidebar({ initialConversations, users }:ConversationListProps) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="border-t -ml-3 md:ml-0 bg-white dark:bg-neutral-950 h-16 justify-evenly fixed z-50 flex-1 w-full md:relative md:h-full bottom-0 md:border-none flex flex-row md:justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 p-2">
        <Link
          href={"/dashboard"}
          className={buttonVariants({
            className:
              "hidden md:flex navLink !mb-10 lg:hover:bg-transparent lg:!p-0",
            variant: "ghost",
            size: "lg",
          })}
        >
          <Handshake className="h-6 w-6 shrink-0 lg:hidden" />
          <p className={"font-semibold text-xl hidden lg:block"}>Home</p>
        </Link>
        <ConversationList users={users} initialConversations={initialConversations} />

        <div className="hidden md:flex md:justify-center relative flex-1 items-end w-full">
          <MoreDropdown />
        </div>
      </div>
    </div>
  );
}
