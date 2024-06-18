import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateComment } from "@/lib/validators/post";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CommPostLikeValidator = z.object({
  postId: z.string(),
});

export const getCommentsWithUser = async (postId: string) => {
  const comments = await db.comment.findMany({
    where: { postId: postId },
    include: { author: true },
  });
  return comments;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.pathname.split("/").pop();

  if (!postId) {
    return new Response("Invalid postid", { status: 400 });
  }

  try {
    const posts = await getCommentsWithUser(postId);
    return new Response(JSON.stringify(posts));
  } catch (error) {
    console.error(error);
    return new Response("Could not fetch posts", { status: 500 });
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
    // console.log(postId);

    const post = await db.post.findUnique({
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
          postId: postId,
          authorId: session?.user.id,
        },
      });
      revalidatePath(`/dashboard`);
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
