import { FunctionComponent, SVGProps } from "react";

export type Glyph = FunctionComponent<SVGProps<SVGSVGElement>>;

export interface Response<T> {
  count: number;
  items: T;
}

export interface Account {
  id: string;
  username: string;
  password: string;
  votesUp: number;
  votesDown: number;
  createdAt: string;
  creatorId: string;
  platform: Platform;
}

export interface Accounts {
  count: number;
  items: Account[];
}

export interface AccountBody {
  username: string;
  password: string;
  creatorId?: string;
  platformId: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
}

type VoteValue = "up" | "down";

export interface FullVote {
  id: string;
  value: VoteValue;
  username: string;
  platformName: string;
}

export interface Vote {
  id: string;
  value: VoteValue;
  creatorId: string;
}

export interface VoteBody {
  value: VoteValue;
  accountId: string;
  creatorId: string;
}

export interface Pagination {
  q?: string;
  limit: number;
  page: number;
  sort: keyof Account | undefined;
  order?: "ASC" | "DESC";
}

export interface CustomError {
  code: number;
  message: string;
}
