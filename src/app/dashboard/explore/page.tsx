import { db } from "@/lib/db";
import Link from "next/link";
import React from "react";

const page = async () => {
  const community = await db.community.findMany({
    include: {
      subscribers: true,
      CommunityPost: true,
      creator:true
    },
  });
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">Explore</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {community.map((comm) => (
          <Link key={comm.id} href={`/dashboard/${comm.id}`}>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-300">
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {comm.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Creator: {comm.creator?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Subscribers: {comm.subscribers.length}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Posts: {comm.CommunityPost.length}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default page;
