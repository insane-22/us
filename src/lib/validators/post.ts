import { z } from "zod";

export const PostValidator = z.object({
  id: z.string(),
  fileUrl: z.string().url().optional(),
  caption: z.string(),
});

export const CreatePostValidator = PostValidator.omit({ id: true });

export type PostCreationRequest = z.infer<typeof CreatePostValidator>;

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  postId: z.string(),
});

export const CreateComment = CommentSchema.omit({ id: true });
export type CommentCreationRequest = z.infer<typeof CreateComment>;