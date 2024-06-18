import { ExtendedCommunityPost } from "@/types/db";
import { cn } from "@/lib/utils";
import ActionIcon from "@/components/ActionIcon";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import LikeButton from "./Like";
import ShareButton from "../ShareButton";

type Props = {
  post: ExtendedCommunityPost;
  userId?: string;
  className?: string;
  currLike: boolean;
};

function PostActions({ post, userId, className, currLike }: Props) {
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
}

export default PostActions;
