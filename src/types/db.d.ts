import type { Community, User, Comment, Like, CommunityPost, Post } from "@prisma/client";

export type ExtendedCommunityPost = CommunityPost & {
  community: Community;
  Like: Like[];
  author: User;
  comments: Comment[];
};

export type ExtendedPost = Post & {
  Like: Like[];
  author: User;
  comments: Comment[];
};
