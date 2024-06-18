"use client";

import { ExtendedCommunityPost } from "@/types/db";
import { cn } from "@/lib/utils";
import { Like } from "@prisma/client";
import { Heart } from "lucide-react";
import { useOptimistic } from "react";
import ActionIcon from "./ActionIcon";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";

function LikeButton({
  post,
  userId,
}: {
  post: ExtendedCommunityPost;
  userId?: string;
}) {
  const predicate = (like: Like) =>
    like.userId === userId && like.communityPostId === post.id;

  const [optimisticLikes, addOptimisticLike] = useOptimistic<Like[]>(
    post.Like,
    //@ts-ignore
    (state: Like[], newLike: Like) =>
      state.some(predicate)
        ? state.filter((like) => like.userId !== userId)
        : [...state, newLike]
  );

  const { mutate: likePost } = useMutation({
    mutationFn: async (postId: string) => {
      await axios.post("/api/community/post/like", { postId });
    },
    onError: (err, postId, context) => {
      startTransition(() => {
        addOptimisticLike(context?.previousLikes);
      });

      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Validation error",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return toast({
            title: "Unauthorized.",
            description: "Please sign in first.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not like/dislike.",
        variant: "destructive",
      });
    },
    onMutate: async (postId: string) => {
      const previousLikes = [...optimisticLikes];
      startTransition(() => {
        addOptimisticLike({ communityPostId: postId, userId });
      });

      return { previousLikes };
    },
  });

  return (
    <div className="flex flex-col">
      <form
        onSubmit={ (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const postId = formData.get("postId") as string;
          // await axios.patch("/api/community/post/like", { postId })
           likePost(postId);
        }}
      >
        <input type="hidden" name="postId" value={post.id} />

        <ActionIcon>
          <Heart
            className={cn("h-6 w-6", {
              "text-red-500 fill-red-500": optimisticLikes.some(predicate),
            })}
          />
        </ActionIcon>
      </form>
      {optimisticLikes.length > 0 && (
        <p className="text-sm font-bold dark:text-white">
          {optimisticLikes.length}{" "}
          {optimisticLikes.length === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
}

export default LikeButton;
