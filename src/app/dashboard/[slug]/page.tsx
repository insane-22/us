import { auth } from "@/auth";
import CreateCommPost from "@/components/Community/CreateCommPost";
import Postfeed from "@/components/Community/Postfeed";
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
    where: { id: slug },
    include: {
      CommunityPost: {
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
      <Postfeed initialPosts={community.CommunityPost} communityName={community.name} />
    </>
  );
};

export default CommunityPage;
