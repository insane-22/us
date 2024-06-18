import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PostLikeValidator } from "@/lib/validators/like";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { postId } = PostLikeValidator.parse(body);

    const existingLike = await db.like.findFirst({
      where: {
        userId: session.user.id,
        postId: postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        Like: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingLike) {
      try {
        await db.like.delete({
          where: {
            postId_userId: {
              userId: session.user.id,
              postId: postId,
            },
          },
        });
        revalidatePath(`/dashboard`);
        return new Response("Removed Like from Post.", { status: 200 });
      } catch (error) {
        return new Response("Failed to remove like from post", { status: 500 });
      }
    } else {
      try {
        await db.like.create({
          data: {
            postId: postId,
            userId: session.user.id,
          },
        });
        revalidatePath(`/dashboard`);
        return new Response("Liked Post.", { status: 200 });
      } catch (error) {
        return new Response("Failed to like post", { status: 500 });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
