// import ToFeedButton from "@/components/ToFeedButton";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";

export const metadata: Metadata = {
  title: "Us",
  description: "A Full stack social media website built with Next.js and TypeScript.",
};

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = await auth();

  const community = await db.community.findFirst({
    where: { id: slug },
    include: {
      CommunityPost: {
        include: {
          author: true,
          Like: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            id: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!community) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      community: {
        id: slug,
      },
    },
  });

  return (
    <div className="sm:container max-w-full mx-auto h-full pt-12">
      <div>
        {/* <ToFeedButton /> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4 bg-slate-700">
              <p className="font-semibold py-3">About {community.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bright:bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created on</dt>
                <dd className="text-gray-100">
                  <time dateTime={community.createdAt.toDateString()}>
                    {format(community.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-100">{memberCount}</div>
                </dd>
              </div>
              {community.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">You created this community</dt>
                </div>
              ) : null}

              {community.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  communityId={community.id}
                  communityName={community.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: "secondary",
                  className: "w-full mb-6",
                })}
                href={`/dashboard/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
