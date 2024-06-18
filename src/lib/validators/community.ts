import { z } from "zod";

export const CommunityValidator = z.object({
  name: z.string().min(3).max(21),
});

export const CommunitySubscriptionValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>;

export const CommPostValidator = z.object({
  id: z.string(),
  communityId: z.string(),
  fileUrl: z.string().url().optional(),
  caption: z.string(),
});

export const CreateCommPostValidator = CommPostValidator.omit({ id: true });
export const DeleteCommPostValidator = CommPostValidator.pick({ id: true });

export type CommPostCreationRequest = z.infer<typeof CreateCommPostValidator>;