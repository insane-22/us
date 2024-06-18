import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import { ExtendedPost } from "@/types/db";

async function fetchPosts() {
  try {
    const response = await axios.get("/api/feed");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

const Posts = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPosts();
  }, []);
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
        // <div key={post.id}>hi</div>
      ))}
    </>
  );
};

export default Posts;
