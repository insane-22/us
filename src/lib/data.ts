import { unstable_noStore as noStore } from "next/cache";
import { db } from "./db";

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

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch profile");
  }
}
