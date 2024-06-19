import { unstable_noStore as noStore } from "next/cache";
import { db } from "./db";
import { UserWithExtras } from "@/types/db";

export async function fetchProfile(username: string) {
  noStore();

  try {
    const data = await db.user.findUnique({
      where: {
        username,
      },
      include: {
        Post: {
          orderBy: {
            createdAt: "desc",
          },
        },
        CommunityPost: {
          orderBy: {
            createdAt: "desc",
          },
        },
        communities: {
          include: {
            community: true,
          },
        },
        createdCommunity: {
          include: {
            subscribers: true,
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
      },
    });

    return data as UserWithExtras;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch profile");
  }
}


export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await db.post.findMany({
      where: {
        author: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        Like: {
          include: {
            user: true,
          },
        },
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const mappedData = data.map((post) => ({
      ...post,
      likes: post.Like,
      comments: post.comments.map((comment) => ({
        ...comment,
        user: comment.author,
      })),
    }));

    return mappedData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}