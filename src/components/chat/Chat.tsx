"use client";
import React, { useCallback, useState } from "react";
import UserAvatar from "../UserAvatar";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const Chat = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/chat", {
        userId: user.id,
      })
      .then((data) => {
        router.push(`/chat/${data.data.id}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, router]);

  return (
    <div onClick={handleClick}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <UserAvatar user={user} />
        <div className="font-semibold text-lg space-y-3">{user.username}</div>
        <div className="text-gray-400">{user.email}</div>
      </div>
    </div>
  );
};

export default Chat;
