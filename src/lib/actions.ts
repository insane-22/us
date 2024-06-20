"use server"
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { FollowUser, UpdateUser } from "./validators/user";
import { z } from "zod";
import { getUser, getUserId } from "./utils";
import { auth } from "@/auth";
import { User } from "@prisma/client";

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();

  const validatedFields = UpdateUser.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Profile.",
    };
  }

  const { bio, image, name, username } = validatedFields.data;

  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        image,
        bio,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Updated Profile." };
  } catch (error) {
    return { message: "Database Error: Failed to Update Profile." };
  }
}

export async function followUser(formData: FormData) {
  const userId = await getUserId();

  const { id } = FollowUser.parse({
    id: formData.get("id"),
  });

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const follows = await db.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: id,
      },
    },
  });

  if (follows) {
    try {
      await db.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: id,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Unfollowed User." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unfollow User.",
      };
    }
  }

  try {
    await db.follows.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Followed User." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Follow User.",
    };
  }
}

export const getUsers = async () => {
  try {
    const session = await auth();

    if (!session?.user?.email) return [];

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) return [];

    const userId = currentUser.id;

    const followers = await db.follows.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true, // Include follower details
      },
    });

    const following = await db.follows.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true, 
      },
    });

    const users = [
      //@ts-ignore
      ...new Set([
        ...followers.map((f) => f.follower),
        ...following.map((f) => f.following),
      ]),
    ];

    return users as User[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getConversations = async () => {
  try {
    const currentUser = await getUser();

    if (!currentUser?.id) return [];

    // Get all users except the current user
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    if (!conversations) return [];

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getUser();

    if (!currentUser) return null;

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    return null;
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};