import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUser } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const currentUser = await getUser();
    const body = await request.json();
    const { userId } = body;

    if (!currentUser?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingConversation = await db.conversation.findFirst({
      where: {
        AND: [
          {
            userIds: {
              has: currentUser.id,
            },
          },
          {
            userIds: {
              has: userId,
            },
          },
        ],
      },
    });

    if (existingConversation) {
      return new Response(JSON.stringify({ id: existingConversation.id }));
    }

    const newConversation = await db.conversation.create({
      data: {
        userIds: [currentUser.id, userId],
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return new Response(JSON.stringify({ id: newConversation.id }));
  } catch (error: any) {
    return new Response("Error in creating conversation", { status: 500 });
  }
}
