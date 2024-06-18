import { z } from "zod";

export const PostLikeValidator = z.object({
  postId: z.string(),
});

export type PostLikeRequest = z.infer<typeof PostLikeValidator>;

export const CommPostLikeValidator = z.object({
  postId: z.string(),
});

export type CommPostLikeRequest = z.infer<typeof CommPostLikeValidator>;
