import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: Request) {
  noStore();

  try {
    const data = await db.post.findMany({
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
    });

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return new Response("Could not fetch posts", { status: 500 });
  }
}
