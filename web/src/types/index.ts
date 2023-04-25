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
  domain: string;
  created_by: string;
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
  votesUp?: number;
  votesDown?: number;
  time?: string;
  createdBy?: string;
}

export interface Platform {
  id: string;
  name: string;
  domain: string;
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
