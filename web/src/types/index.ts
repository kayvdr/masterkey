import { FunctionComponent, SVGProps } from "react";

export type Glyph = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface UsersResponse {
  count: number;
  items: UserResponse[];
}

export interface UserResponse {
  id?: string;
  username: string;
  password?: string;
  platformId: string;
  votesUp?: number;
  votesDown?: number;
  createdAt?: string;
}

export interface FullUserResponse {
  id?: string;
  username: string;
  password?: string;
  platformId: string;
  votesUp?: number;
  votesDown?: number;
  createdAt?: string;
  platformName: string;
  platformUrl: string;
  creatorId: string;
}

export interface FullUser {
  id?: string;
  username: string;
  password?: string;
  platform: {
    id: string | undefined;
    href: string | undefined;
    icon: Glyph | undefined;
    name: string | undefined;
  };
  votesUp: number;
  votesDown: number;
  time?: string;
  creatorId?: string;
}

export interface User {
  id?: string;
  username: string;
  password?: string;
  platform: {
    id: string | undefined;
    href: string | undefined;
    icon: Glyph | undefined;
    name: string | undefined;
  };
  time?: string;
  creatorId?: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
}

export interface FullVoteResponse {
  id?: string;
  value: "up" | "down";
  username: string;
  platformName: string;
}

export interface VoteResponse {
  id?: string;
  value: "up" | "down";
  userId: string;
  creatorId: string;
}

export interface Vote {
  id?: string;
  value: "up" | "down";
  userId: string;
  creatorId: string;
}

export interface Pagination {
  q?: string;
  limit: number;
  page: number;
  sort: keyof UserResponse | undefined;
  order?: "ASC" | "DESC";
}

export interface CustomError {
  code: number;
  message: string;
}
