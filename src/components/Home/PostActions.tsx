import { ExtendedPost } from "@/types/db";
import React from "react";
import LikeButton from "./Like";
import { cn } from "@/lib/utils";
import { Link, MessageCircle } from "lucide-react";
import ActionIcon from "../ActionIcon";
import ShareButton from "../ShareButton";

type Props = {
  post: ExtendedPost;
  userId?: string;
  className?: string;
  currLike: boolean;
};

const PostActions = ({ post, userId, className,currLike }: Props) => {
  return (
    <div className={cn("relative flex items-start w-full gap-x-2", className)}>
      <LikeButton
        currLike={currLike}
        likeCnt={post.Like.length}
        postId={post.id}
        userId={userId}
      />
      <Link href={`/dashboard/p/${post.id}`}>
        <ActionIcon>
          <MessageCircle className={"h-6 w-6"} />
        </ActionIcon>
      </Link>
      <ShareButton postId={post.id} />
    </div>
  );
};

export default PostActions;
