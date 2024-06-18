"use client";

import { ExtendedCommunityPost } from "@/types/db";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/SubmitButton";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  post: ExtendedCommunityPost;
  userId?: string;
  className?: string;
};

function PostOptions({ post, userId, className }: Props) {
  const router = useRouter();
  const isPostMine = post.authorId === userId;
  // const [isVisible, setIsVisible] = useState(true);

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/community/post?id=${id}`);
      return data;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not delete post",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      router.push(`/dashboard/${post.communityId}`);
      // setIsVisible(false);
    },
  });

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            "h-5 w-5 cursor-pointer dark:text-neutral-400",
            className
          )}
        />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        {isPostMine && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              deletePostMutation.mutate(post.id);
            }}
            className="postOption"
          >
            <input type="hidden" name="id" value={post.id} />
            <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
              Delete post
            </SubmitButton>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/dashboard/p/${post.id}/edit`}
            className="postOption p-3"
          >
            Edit
          </Link>
        )}

        <form action="" className="postOption border-0">
          <button className="w-full p-3">Hide like count</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PostOptions;
