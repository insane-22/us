import type { Community, User, Comment, Like, CommunityPost } from "@prisma/client";

export type ExtendedCommunityPost = CommunityPost & {
  community: Community;
  Like: Like[];
  author: User;
  comments: Comment[];
};
