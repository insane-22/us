"use client";

import { CommentWithExtras } from "@/types/post";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Comment } from "@prisma/client";
import { User } from "next-auth";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CommentCreationRequest, CreateComment } from "@/lib/validators/post";
import { MessageSquare } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function Comments({
  postId,
  comments,
  user,
}: {
  postId: string;
  comments: CommentWithExtras[];
  user?: User | null;
}) {
  const form = useForm<CommentCreationRequest>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      content: "",
      postId: postId,
    },
  });
  // console.log(form);
  let [isPending, startTransition] = useTransition();
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    CommentWithExtras[]
  >(
    comments,
    // @ts-ignore
    (state: Comment[], newComment: string) => [
      { content: newComment, userId: user?.id, postId, user },
      ...state,
    ]
  );
  const content = form.watch("content");
  const commentsCount = optimisticComments.length;
  const router = useRouter();

  const { mutate: createComment } = useMutation({
    mutationFn: async (values: CommentCreationRequest) => {
      console.log(values);
      const { data } = await axios.post(
        `/api/feed/comment/${postId}`,
        values
      );
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: "Validation error",
            description: "Please fill field wisely",
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
      console.log(err);

      toast({
        title: "There was an error.",
        description: "Could not create community.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.refresh();
    },
  });

  return (
    <div className="space-y-0.5 px-3 sm:px-0">
      {commentsCount > 1 && (
        <Link
          scroll={false}
          href={`/dashboard/p/${postId}`}
          className="text-sm font-medium text-neutral-500"
        >
          <MessageSquare className="h-4 w-4" />
          View all {commentsCount} comments
        </Link>
      )}

      {optimisticComments.slice(0, 3).map((comment, i) => {
        const username = comment.user?.username;

        return (
          <div
            key={i}
            className="text-sm flex items-center space-x-2 font-medium"
          >
            <Link href={`/dashboard/${username}`} className="font-semibold">
              {username}
            </Link>
            <p>{comment.text}</p>
          </div>
        );
      })}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            const valuesCopy = { ...values };
            form.reset();
            startTransition(() => {
              addOptimisticComment(valuesCopy.content);
            });

            createComment(valuesCopy);
          })}
          className="border-b border-gray-300 dark:border-neutral-800 pb-3 py-1 flex items-center space-x-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <FormItem className="w-full flex">
                <FormControl>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-transparent text-sm border-none focus:outline-none flex-1 placeholder-neutral-500 dark:text-white dark:placeholder-neutral-400 font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {content.trim().length > 0 && (
            <button
              type="submit"
              className="text-sky-500 text-sm font-semibold hover:text-white disabled:hover:text-sky-500 disabled:cursor-not-allowed"
            >
              Post
            </button>
          )}
        </form>
      </Form>
    </div>
  );
}

export default Comments;
