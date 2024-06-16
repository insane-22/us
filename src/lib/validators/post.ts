import { z } from "zod";

export const PostValidator = z.object({
  id: z.string(),
  communityId: z.string().optional(),
  fileUrl: z.string().url().optional(),
  caption: z.string(),
});

export const CreatePostValidator = PostValidator.omit({ id: true });

export type PostCreationRequest = z.infer<typeof CreatePostValidator>;
