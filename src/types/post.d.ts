import { Comment, CommunityPost, Like, User } from "@prisma/client";

export type PostWithExtras = CommunityPost & {
  comments: CommentWithExtras[];
  likes: LikeWithExtras[];
  user: User;
};

export type CommentWithExtras = Comment & { user: User };
export type LikeWithExtras = Like & { user: User };