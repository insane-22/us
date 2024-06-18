"use client";
import { Suspense } from "react";
import { PostsSkeleton } from "../Skeleton";
import Posts from "./Posts";

const GeneralFeed = () => {
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </ul>
  );
};

export default GeneralFeed;
