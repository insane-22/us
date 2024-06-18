import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CommPostLikeValidator } from "@/lib/validators/like";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { postId } = CommPostLikeValidator.parse(body);

    const existingLike = await db.like.findFirst({
      where: {
        userId: session.user.id,
        communityPostId: postId,
      },
    });

    const post = await db.communityPost.findUnique({
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
            communityPostId_userId: {
              userId: session.user.id,
              communityPostId: postId,
            },
          },
        });
        revalidatePath(`/dashboard/${post.communityId}`);
        return new Response("Removed Like from Post.", { status: 200 });
      } catch (error) {
        return new Response("Failed to remove like from post", { status: 500 });
      }
    } else {
      try {
        await db.like.create({
          data: {
            communityPostId: postId,
            userId: session.user.id,
          },
        });
        revalidatePath(`/dashboard/${post.communityId}`);
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
