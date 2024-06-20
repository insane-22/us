  import UserAvatar from "@/components/UserAvatar";
  import Chat from "@/components/chat/Chat";
  import { getUsers } from "@/lib/actions";
  import Link from "next/link";
  import React from "react";

  const Page = async () => {
    const users = await getUsers();

    return (
      <div className="px-12">
        <h1 className="text-8xl font-medium">Available for chat</h1>
        <div className="py-10 lg:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {users.length > 0 ? (
            users.map((user, i) => <Chat key={i} user={user} />)
          ) : (
            <div>
              You can only chat with either a follower or a person you are
              following. There are amazing people there; try connecting.
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Page;
