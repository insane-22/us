"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { usePrevious } from "@mantine/hooks";
import { CommPostLikeRequest } from "@/lib/validators/like";
import { Button } from "../ui/button";

function LikeButton({
  postId,
  userId,
  currLike,
  likeCnt,
}: {
  postId: string;
  userId?: string;
  currLike: boolean;
  likeCnt: number;
}) {
  const [likeAmt, setLikeAmt] = useState<number>(likeCnt);
  const [currentLike, setCurrentLike] = useState(currLike);
  const prevLike = usePrevious(currentLike);

  useEffect(() => {
    setCurrentLike(currLike);
    setLikeAmt(likeCnt);
  }, [currLike, likeCnt]);

  const { mutate: like } = useMutation({
    mutationFn: async () => {
      const payload: CommPostLikeRequest = {
        postId: postId,
      };

      await axios.patch("/api/community/post/like", payload);
    },
    onError: (err) => {
      // Revert like amount if mutation fails
      if (currentLike) {
        setLikeAmt((prev) => prev - 1);
      } else {
        setLikeAmt((prev) => prev + 1);
      }

      // Reset current like status
      if (prevLike) {
        setCurrentLike(prevLike);
      }

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
    onSuccess: () => {
      if (currentLike) {
        // If user liked the post, remove the like
        setCurrentLike(false);
        setLikeAmt((prev) => prev - 1);
      } else {
        // If user didn't like the post, add the like
        setCurrentLike(true);
        setLikeAmt((prev) => prev + 1);
      }
    },
  });

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={() => like()}
        size="sm"
        variant="ghost"
        aria-label="like"
      >
        <Heart
          className={cn("h-6 w-6", {
            "text-red-500 fill-red-500": currentLike === true,
          })}
        />
      </Button>
      {likeAmt > 0 && (
        <p className="text-sm font-bold dark:text-white">
          {likeAmt} {likeAmt === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
}

export default LikeButton;
