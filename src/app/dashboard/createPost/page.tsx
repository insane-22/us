"use client";

import Error from "@/components/Error";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMount from "@/hooks/useMount";
import {
  CreatePostValidator,
  PostCreationRequest,
} from "@/lib/validators/post";
// import { createPost } from "@/lib/actions";
// import { CreatePost } from "@/lib/schemas";
import { UploadButton } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

const CreatePostPage = () => {
  const pathname = usePathname();
  const isCreatePage = pathname === "/dashboard/createPost";
  const router = useRouter();
  const mount = useMount();

  const form = useForm<PostCreationRequest>({
    resolver: zodResolver(CreatePostValidator),
    defaultValues: {
      caption: undefined,
      fileUrl: undefined,
    },
  });
  const fileUrl = form.watch("fileUrl");

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (values: PostCreationRequest) => {
      const { data } = await axios.post("/api/post", values);
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
      router.push(`/dashboard`);
    },
  });

  if (!mount) return null;
  return (
    <div>
      <Dialog
        open={isCreatePage}
        onOpenChange={(open) => !open && router.back()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                createPost(values);
                toast({
                  title: "Success",
                  description: "Post added successfully!.",
                });
              })}
              className="space-y-4"
            >
              {!!fileUrl ? (
                <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                  <AspectRatio ratio={1 / 1} className="relative h-full">
                    <Image
                      src={fileUrl}
                      alt="Post preview"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel htmlFor="picture">Picture</FormLabel>
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            form.setValue("fileUrl", res[0].url);
                            toast({
                              title: "Success",
                              description: "File added successfully!.",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            console.error(error);
                            toast({
                              title: "Error!",
                              description: "Upload failed",
                              variant: "destructive",
                            });
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a picture to post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="caption">Caption</FormLabel>
                    <FormControl>
                      <Input
                        type="caption"
                        id="caption"
                        placeholder="Write a caption..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create Post
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePostPage;
