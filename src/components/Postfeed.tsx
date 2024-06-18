"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { ExtendedCommunityPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import { useSession } from "next-auth/react";

interface PostFeedProps {
  initialPosts: ExtendedCommunityPost[];
  communityName?: string;
}

const Postfeed = ({ initialPosts, communityName }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const [posts, setPosts] = useState<ExtendedCommunityPost[]>();
  const { data: session } = useSession();

  //limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}  &
  // const { data: session } = useSession();
  // const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
  //   queryKey: ["infinite-query"],
  //   queryFn: async ({ pageParam = 1 }) => {
  //     const query =
  //       `/api/community/post?` +
  //       (!!communityName ? `communityName=${communityName}` : "");

  //     const { data } = await axios.get(query);
  //     return data as ExtendedCommunityPost[];
  //   },
  //   getNextPageParam: (_, pages) => {
  //     return pages.length + 1;
  //   },
  //   initialData: { pages: [initialPosts], pageParams: [1] },
  //   initialPageParam: 10,
  // });
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `/api/community/post?` +
         (!!communityName ? `communityName=${communityName}` : "")
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPosts();
  }, [communityName]);

  // useEffect(() => {
  //   if (entry?.isIntersecting) {
  //     fetchNextPage(); // Load more posts when the last post comes into view
  //   }
  // }, [entry, fetchNextPage]);

  // const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  // console.log(posts)

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts && posts.map((post, idx) => {
        const currLike = post.Like.find(
          (vote) => vote.userId === session?.user.id
        );

        if (idx === posts.length - 1) {
          return (
            <li key={idx} ref={ref}>
              <Post post={post} />
              {/* <>hi</> */}
            </li>
          );
        } else {
          return (
            <li key={idx}>
              <Post post={post} />
            </li>
          );
        }
      })}
    </ul>
  );
};

export default Postfeed;
