import useSWR from "swr";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import {
  Account,
  AccountPatchBody,
  AccountPostBody,
  Pagination,
  Platform,
  Vote,
  VoteBody,
} from "../types";

interface FetcherOptions {
  url: string;
  query?: object;
  signal?: AbortSignal;
}

const api = wretch().addon(QueryStringAddon).url("/api/v1");

const fetcher = <Response>({ url, query, signal }: FetcherOptions) =>
  api
    .options({ signal })
    .url(url)
    .query(query ?? {})
    .get()
    .json<Response>();

export const getAccounts = (pagination?: Pagination) =>
  useSWR({ url: `/accounts`, query: pagination }, (opts) =>
    fetcher<{ total: number; accounts: Account[] }>(opts)
  );

export const getAccount = (id: string | undefined) =>
  useSWR(id ? { url: `/accounts/${id}` } : null, (opts) =>
    fetcher<Account>(opts)
  );

export const getAccountsByCreatorId = (
  id: string | undefined,
  pagination?: Pagination
) =>
  useSWR(
    id ? { url: `/creators/${id}/accounts`, query: pagination } : null,
    (opts) => fetcher<{ total: number; accounts: Account[] }>(opts)
  );

export const createAccount = (body: AccountPostBody) =>
  api.url(`/accounts`).post(body).json<Account>();

export const updateAccount = (id: string, body: AccountPatchBody) =>
  api.url(`/accounts/${id}`).patch(body).json<Account>();

export const deleteAccount = (id: string) =>
  api.url(`/accounts/${id}`).delete().res();

export const getPlatforms = () =>
  useSWR({ url: `/platforms` }, (opts) =>
    fetcher<{ platforms: Platform[] }>(opts)
  );

export const getVotesByAccountId = (id: string | undefined) =>
  useSWR(id ? { url: `/accounts/${id}/votes` } : null, (opts) =>
    fetcher<{ total: number; votes: Vote[] }>(opts)
  );

export const getVotesByCreatorId = (
  id: string | undefined,
  pagination?: Pagination
) =>
  useSWR(
    id ? { url: `/creators/${id}/accounts/votes`, query: pagination } : null,
    (opts) => fetcher<{ total: number; accounts: Account[] }>(opts)
  );

export const createVote = (body: VoteBody) =>
  api.url(`/votes`).post(body).json<Vote>();

export const deleteVote = (id: string) =>
  api.url(`/votes/${id}`).delete().res();
