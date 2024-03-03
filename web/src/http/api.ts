import useSWR from "swr";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import {
  Account,
  AccountBody,
  FullVote,
  ListFilters,
  Paginated,
  Platform,
  Vote,
  VoteBody,
} from "../types";

interface FetcherOptions {
  url: string;
  query?: object;
  signal?: AbortSignal;
}

const api = wretch().addon(QueryStringAddon).url("http://localhost:60001/v1");

const fetcher = <Response>({ url, query, signal }: FetcherOptions) =>
  api
    .options({ signal })
    .url(url)
    .query(query ?? {})
    .get()
    .json<Response>();

export const getAccounts = (filters?: ListFilters) =>
  useSWR({ url: `/accounts`, query: filters }, (opts) =>
    fetcher<Paginated<Account[]>>(opts)
  );

export const getAccount = (id: string) =>
  useSWR(id ? { url: `/accounts/${id}` } : null, (opts) =>
    fetcher<Account>(opts)
  );

export const getAccountsByCreatorId = (id: string) =>
  useSWR(id ? { url: `/creators/${id}/accounts` } : null, (opts) =>
    fetcher<Paginated<Account[]>>(opts)
  );

export const setAccount = (body: AccountBody) =>
  api.url(`/accounts`).post(body).json<Account>();

export const updateAccount = (id: string, body: AccountBody) =>
  api.url(`/accounts/${id}`).patch(body).json<Account>();

export const deleteAccount = (id: string) =>
  api.url(`/accounts/${id}`).delete().res();

export const getPlatforms = () =>
  useSWR({ url: `/platforms` }, (opts) => fetcher<Platform[]>(opts));

export const getVote = (id: string) =>
  useSWR(id ? { url: `/accounts/${id}/votes` } : null, (opts) =>
    fetcher<Vote[]>(opts)
  );

export const getVotesByCreatorId = (id: string) =>
  useSWR(id ? { url: `/creators/${id}/votes` } : null, (opts) =>
    fetcher<Paginated<FullVote[]>>(opts)
  );

export const setVote = (body: VoteBody) =>
  api.url(`/votes`).post(body).json<Vote>();

export const deleteVote = (id: string) =>
  api.url(`/votes/${id}`).delete().res();
