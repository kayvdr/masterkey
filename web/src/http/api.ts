import { encode } from "base-64";
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
}

const basicAuth = encode(
  `${import.meta.env.VITE_BASIC_USER}:${import.meta.env.VITE_BASIC_PASS}`
);

const api = wretch()
  .addon(QueryStringAddon)
  .url("/api/v1")
  .auth(`Basic ${basicAuth}`);

const fetcher = <Response>({ url, query }: FetcherOptions) =>
  api
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

export const createAccount = (body: AccountPostBody, token: string) =>
  api
    .url(`/accounts`)
    .headers({ "X-Supabase-Auth": token })
    .post(body)
    .json<Account>();

export const updateAccount = (
  id: string,
  body: AccountPatchBody,
  token: string
) =>
  api
    .url(`/accounts/${id}`)
    .headers({ "X-Supabase-Auth": token })
    .patch(body)
    .json<Account>();

export const deleteAccount = (id: string, token: string) =>
  api
    .url(`/accounts/${id}`)
    .headers({ "X-Supabase-Auth": token })
    .delete()
    .res();

export const getPlatforms = () =>
  useSWR({ url: `/platforms` }, (opts) =>
    fetcher<{ platforms: Platform[] }>(opts)
  );

export const getVotesByCreatorId = (
  id: string | undefined,
  pagination?: Pagination
) =>
  useSWR(
    id ? { url: `/creators/${id}/accounts/votes`, query: pagination } : null,
    (opts) => fetcher<{ total: number; accounts: Account[] }>(opts)
  );

export const getVotesByAccountId = (
  creatorId: string | undefined,
  accountId: string | undefined
) =>
  useSWR(
    creatorId && accountId
      ? { url: `/creators/${creatorId}/accounts/${accountId}/votes` }
      : null,
    (opts) => fetcher<Vote>(opts)
  );

export const createVote = (body: VoteBody, token: string) =>
  api
    .url(`/votes`)
    .headers({ "X-Supabase-Auth": token })
    .post(body)
    .json<Vote>();

export const deleteVote = (id: string, token: string) =>
  api.url(`/votes/${id}`).headers({ "X-Supabase-Auth": token }).delete().res();
