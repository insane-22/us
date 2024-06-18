import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = CommunityValidator.parse(body);

    const exists = await db.community.findFirst({
      where: { name },
    });

    if (exists) {
      return new Response("Community with same name already exists", {
        status: 409,
      });
    }

    const community = await db.community.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    return new Response(community.id);
  } catch (error) {
    if(error instanceof z.ZodError){
        return new Response(error.message, { status: 422 });
    }
    return new Response("Error in creating subreddit", { status: 500 });
  }
}
