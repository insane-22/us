import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CommentCreationRequest, CreateComment } from "@/lib/validators/post";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { MessageSquare } from "lucide-react";
import { CommentWithExtras } from "@/types/post";
import { User } from "next-auth";

const fetchComments = async (postId: string) => {
  const { data } = await axios.get(`/api/feed/comment/${postId}`);
  return data;
};

function Comments({ postId, user }: { postId: string; user?: User | null }) {
  const form = useForm<CommentCreationRequest>({
    resolver: zodResolver(CreateComment),
    defaultValues: {
      content: "",
      postId: postId,
    },
  });

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const [isPending, startTransition] = useTransition();
  const [optimisticComments, setOptimisticComments] = useState<
    CommentWithExtras[]
  >([]);
  const content = form.watch("content");
  const commentsCount = comments.length + optimisticComments.length;
  const router = useRouter();
  const queryClient = useQueryClient();

  const mergedComments = [...optimisticComments, ...comments];

  const { mutate: createComment } = useMutation({
    mutationFn: async (values: CommentCreationRequest) => {
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
        description: "Could not create comment.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      refetch();
      router.refresh();
      setOptimisticComments([]);
    },
  });

  return (
    <div className="space-y-0.5 px-3 sm:px-0">
      {commentsCount > 1 && (
        <Link
          scroll={false}
          href={`/dashboard/p/${postId}`}
          className="flex items-center gap-2 text-sm font-medium text-neutral-500"
        >
          <MessageSquare className="h-4 w-4" />
          View all {commentsCount} comments
        </Link>
      )}

      {mergedComments.slice(0, 3).map((comment, i) => {
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

      {user ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              const valuesCopy = { ...values };
              form.reset();
              startTransition(() => {
                //@ts-ignore
                setOptimisticComments((prevComments) => [
                  {
                    ...valuesCopy,
                    user: user,
                    text: valuesCopy.content,
                  },
                  ...prevComments,
                ]);
              });

              createComment(valuesCopy);
            })}
            className="border-b border-gray-300 dark:border-neutral-800 pb-3 py-1 flex items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
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
      ) : (
        <>register to comment</>
      )}
    </div>
  );
}

export default Comments;
