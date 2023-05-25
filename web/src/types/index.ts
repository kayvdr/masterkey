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
  platform_id: string;
  votes_up?: number;
  votes_down?: number;
  created_at?: string;
}

export interface FullUserResponse {
  id?: string;
  username: string;
  password?: string;
  platform_id: string;
  votes_up?: number;
  votes_down?: number;
  created_at?: string;
  name: string;
  url: string;
  created_by: string;
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
  createdBy?: string;
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
  createdBy?: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
}

export interface VoteResponse {
  id?: string;
  value: "up" | "down";
  user_id: string;
  created_by: string;
}

export interface Vote {
  id?: string;
  value: "up" | "down";
  userId: string;
  createdBy: string;
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
