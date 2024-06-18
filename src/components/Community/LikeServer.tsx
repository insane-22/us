import { auth } from "@/auth";
import { Like, Post } from "@prisma/client";
import { notFound } from "next/navigation";

const LikeServer = async ({
  postId,
  userId,
  currLike,
  likeCnt,
  getData,
}: {
  postId: string;
  userId?: string;
  currLike: boolean;
  likeCnt: number;
  getData?: () => Promise<Post & { likes: Like[] }>;
}) => {
  const session = await auth();
  let _likeCnt: number = 0;
  let like: Like | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _likeCnt = post.likes.reduce((acc) => {
      return acc + 1;
    }, 0);

    like = post.likes.find((vote) => vote.userId === userId);
  }
  return <div></div>;
};

export default LikeServer;
