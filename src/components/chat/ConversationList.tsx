"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
// import { MdOutlineGroupAdd } from "react-icons/md";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { FullConversationType } from "@/types/db";
import ConversationBox from "./ConversationBox";
import useConversation from "@/hooks/useConversation";
import { find } from "lodash";

interface ConversationListProps {
  initialConversations: FullConversationType[];
  users: User[];
}

export default function ConversationList({
  initialConversations,
  users,
}: ConversationListProps) {
  const session = useSession();
  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setConversations((prevConversations) => {
        if (find(prevConversations, { id: conversation.id }))
          return prevConversations;
        return [conversation, ...prevConversations];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setConversations((prevConversations) =>
        prevConversations.map((c) => {
          if (c.id === conversation.id) {
            return { ...c, messages: conversation.messages };
          }

          return c;
        })
      );
    };

    const deleteHandler = (conversation: FullConversationType) => {
      setConversations((prevConversations) =>
        prevConversations.filter((c) => c.id !== conversation.id)
      );

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <aside className={clsx("block w-full left-0")}>
        <div className="px-5">
          <div className="flex justify-between mb-4 py-4 border-b">
            <div className="text-2xl font-bold ">Chats</div>
          </div>

          {conversations.map((conversation) => (
            <ConversationBox
              key={conversation.id}
              conversation={conversation}
              selected={conversationId === conversation.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
