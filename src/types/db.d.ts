import type {
  Community,
  User,
  Comment,
  Like,
  CommunityPost,
  Post,
  Subscription,
} from "@prisma/client";

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

export type UserWithExtras = User & {
  Post: Post[];
  communityPosts?: CommunityPost[];
  communities?: Subscription[];
  createdCommunity?: Community[];
  followedBy: FollowerWithExtras[];
  following: FollowingWithExtras[];
};
