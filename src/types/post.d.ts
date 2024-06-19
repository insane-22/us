import { Comment, CommunityPost, Like, Post, User } from "@prisma/client";

export type PostWithExtras = CommunityPost & {
  comments: CommentWithExtras[];
  likes: LikeWithExtras[];
  user: User;
};

export type PersonalPostWithExtras = Post & {
  comments: CommentWithExtras[];
  likes: LikeWithExtras[];
  author: User;
};

export type CommentWithExtras = Comment & { user: User };
export type LikeWithExtras = Like & { user: User };