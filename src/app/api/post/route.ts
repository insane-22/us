import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreatePostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { fileUrl, caption} = CreatePostValidator.parse(body);

    const post = await db.post.create({
      data: {
        caption,
        fileUrl,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return new Response(post.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Error in creating subreddit", { status: 500 });
  }
}
