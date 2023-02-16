import { FunctionComponent, SVGProps } from "react";

export type Glyph = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface UsersResponse {
  count: number;
  items: User[];
}

export interface User {
  id?: string;
  username: string;
  password: string;
  platform_id: string;
  votes_up?: number;
  votes_down?: number;
  created_at?: string;
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
  sort: keyof User | undefined;
  order?: "ASC" | "DESC";
}
