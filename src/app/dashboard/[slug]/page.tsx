import { auth } from "@/auth";
import CreateCommPost from "@/components/CreateCommPost";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const CommunityPage = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await auth();
  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          Like: true,
          comments: true,
          community: true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  if (!community) return notFound();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        {community.name}
      </h1>
      <CreateCommPost session={session} />
      {/* <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} /> */}
    </>
  );
};

export default CommunityPage;
