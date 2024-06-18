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
import { HomeIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Us",
  description:
    "A Full stack social media website built with Next.js and TypeScript.",
};

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  
  return (
    <div className="sm:container w-full h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="bg-slate-500 px-6 py-4">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <HomeIcon className="h-4 w-4" />
                Home
              </p>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Your personal Breadit frontpage. Come here to check in with
                  your favorite communities.
                </p>
              </div>

              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/dashboard/create`}
              >
                Create Community
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
