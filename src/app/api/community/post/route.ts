import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  CreateCommPostValidator,
  DeleteCommPostValidator,
} from "@/lib/validators/community";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { fileUrl, caption, communityId } =
      CreateCommPostValidator.parse(body);

    const post = await db.communityPost.create({
      data: {
        caption,
        fileUrl,
        community: {
          connect: {
            id: communityId,
          },
        },
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
    return new Response("Error in creating community", { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await auth();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map((sub) => sub.community.id);
  }

  try {
    const {  communityName } = z
      .object({
        communityName: z.string().nullish().optional(),
      })
      .parse({
        communityName: url.searchParams.get("communityName"),
      });

    let whereClause = {};

    if (communityName) {
      whereClause = {
        community: {
          name: communityName,
        },
      };
    } else if (session) {
      whereClause = {
        community: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }else{
      
    }

    const posts = await db.communityPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        community: true,
        Like: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  const searchParams = req.nextUrl.searchParams;
  const postId = searchParams.get("id");

  if (!postId) {
    throw new Error("Post not found");
  }
  console.log(postId);

  const post = await db.communityPost.findUnique({
    where: {
      id: postId,
      authorId: session?.user.id,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await db.communityPost.delete({
      where: {
        id: postId,
      },
    });
    return new Response(JSON.stringify({ message: "Deleted Post" }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Error in deleting post", { status: 500 });
  }
}
