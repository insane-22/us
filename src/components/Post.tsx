"use-client";
import { ExtendedCommunityPost } from "@/types/db";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Timestamp from "./Timestamp";
import PostOptions from "./PostOptions";
import { Card } from "./ui/card";
import Image from "next/image";
import PostActions from "./PostActions";
import Comments from "./Comments";
import { CommentWithExtras } from "@/types/post";
import { useEffect, useState } from "react";
import axios from "axios";

const Post = ({ post }: { post: ExtendedCommunityPost }) => {
  const { data: session } = useSession();
  const [commentsWithExtras, setCommentsWithExtras] = useState<
    CommentWithExtras[]
  >([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `/api/community/post/comment/${post.id}`
        );
        setCommentsWithExtras(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.id]);

  return (
    <div className="flex flex-col space-y-2.5 dark:bg-neutral-950">
      <div className="flex items-center justify-between px-3 sm:px-0">
        <div className="flex space-x-3 items-center">
          <UserAvatar user={post.author} />
          <div className="text-sm">
            <p className="space-x-1">
              <span className="font-semibold">{post.author.username}</span>
              <span
                className="font-medium text-neutral-500 dark:text-neutral-400
                      text-xs
                    "
              >
                •
              </span>
              <Timestamp createdAt={post.createdAt} />
            </p>
            <p className="text-xs text-black dark:text-white font-medium">
              {post.author.bio?.substring(0, 10)}
            </p>
          </div>
        </div>

        <PostOptions post={post} userId={session?.user.id} />
      </div>

      {post.caption && (
        <>
          <Link
            href={`/dashboard/${post.author.username}`}
            className="font-bold"
          >
            {post.author.username}
          </Link>
          <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
            {/* <Link
              href={`/dashboard/${post.author.username}`}
              className="font-bold"
            > */}
            <p>{post.caption}</p>
            {/* </Link> */}
          </div>
        </>
      )}

      {post.fileUrl && (
        <Card className="relative h-[450px] w-full overflow-hidden rounded-none sm:rounded-md">
          <Image
            src={post.fileUrl}
            alt="Post Image"
            fill
            className="sm:rounded-md object-cover"
          />
        </Card>
      )}

      <PostActions
        post={post}
        userId={session?.user.id}
        className="px-3 sm:px-0"
      />

      {/* {post.id} */}
      <Comments
        postId={post.id}
        comments={commentsWithExtras}
        user={session?.user}
      />
    </div>
  );
};

export default Post;
