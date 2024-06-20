import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateComment } from "@/lib/validators/post";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CommPostLikeValidator = z.object({
  postId: z.string(),
});

const getCommentsWithUser = async (postId: string) => {
  const comments = await db.comment.findMany({
    where: { communityPostId: postId },
    include: { author: true },
    orderBy: {
      createdAt: "desc",
    },
  });
  return comments.map((comment) => ({
    ...comment,
    user: {
      id: comment.author.id,
      username: comment.author.username,
    },
  }));
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.pathname.split("/").pop();

  if (!postId) {
    return new Response("Invalid postid", { status: 400 });
  }

  try {
    const comments = await getCommentsWithUser(postId);
    return new Response(JSON.stringify(comments));
  } catch (error) {
    console.error(error);
    return new Response("Could not fetch comments", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { content, postId } = CreateComment.parse(body);

    const post = await db.communityPost.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new Response("Invalid postid", { status: 400 });
    }

    try {
      await db.comment.create({
        data: {
          text: content,
          communityPostId: postId,
          authorId: session?.user.id,
        },
      });
      revalidatePath(`/dashboard/${post.communityId}`);
      return new Response("comment added");
    } catch (error) {
      console.error(error);
      return new Response("Could not create comment", { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Could not comment", { status: 500 });
  }
}
