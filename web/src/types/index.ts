import { FunctionComponent, SVGProps } from "react";

export type Glyph = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface Pagination {
  q?: string;
  page: number;
  limit: number;
  sort: keyof Account | undefined;
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

export type VoteValue = "up" | "down";

export interface VoteBody {
  value: VoteValue;
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

export interface DeleteUserPostBody {
  user_id: string;
}
