import { FunctionComponent, SVGProps } from "react";

export type Glyph = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface ListFilters {
  q?: string;
  page: number;
  limit: number;
  sort: keyof Account | undefined;
  order?: "ASC" | "DESC";
}

export interface AccountPatchBody {
  username: string;
  password: string;
  platform_id: string;
}

export interface AccountPostBody extends AccountPatchBody {
  creator_id: string;
}

export interface Account extends AccountPostBody {
  id: string;
  votes_up: number;
  votes_down: number;
  created_at: string;
  platform_name: string;
  platform_url: string;
}

export interface VoteBody {
  value: "up" | "down";
  account_id: string;
  creator_id: string;
}

export interface Vote extends VoteBody {
  id: string;
  username: string;
  platform_name: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
}

export interface CustomError {
  code: number;
  message: string;
}
