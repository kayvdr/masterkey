import {
  Account,
  AccountResponse,
  FullAccountResponse,
  FullVoteResponse,
  Pagination,
  Platform,
  Vote,
  VoteResponse,
} from "../types";

const baseUrl = "http://localhost:60001";

const fetchData = async <Response>(
  url: string,
  options: RequestInit
): Promise<Response | undefined> => {
  const response = await fetch(url, options);
  if (response.status !== 200) return;
  return await response.json();
};

export const getAccounts = async (pagination?: Pagination) => {
  let url = `${baseUrl}/v1/accounts`;

  if (pagination) {
    const searchParams = new URLSearchParams();
    pagination.q && searchParams.set("q", pagination.q);
    searchParams.set("limit", String(pagination.limit));
    searchParams.set("page", String(pagination.page));
    pagination.sort && searchParams.set("sort", String(pagination.sort));
    pagination.sort && searchParams.set("order", String(pagination.order));

    url = `${url}?${searchParams.toString()}`;
  }

  return await fetchData<{ count: number; items: FullAccountResponse[] }>(url, {
    method: "GET",
  });
};

export const getAccountsByCreatorId = async (id: string) => {
  return await fetchData<{ count: number; items: FullAccountResponse[] }>(
    `${baseUrl}/v1/creators/${id}/accounts`,
    {
      method: "GET",
    }
  );
};

export const setAccount = async (account: Account) => {
  return await fetch(`${baseUrl}/v1/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: account.username,
      password: account.password,
      platformId: account.platform.id,
      creatorId: account.creatorId,
    }),
  });
};

export const getAccount = async (id: string) => {
  return await fetchData<AccountResponse>(`${baseUrl}/v1/accounts/${id}`, {
    method: "GET",
  });
};

export const patchAccount = async (account: Account) => {
  return await fetch(`${baseUrl}/v1/accounts/${account.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: account.username,
      password: account.password,
      platformId: account.platform.id,
    }),
  });
};

export const deleteAccount = async (id: string) => {
  return await fetchData(`${baseUrl}/v1/accounts/${id}`, {
    method: "DELETE",
  });
};

export const getPlatforms = async () => {
  return await fetchData<Platform[]>(`${baseUrl}/v1/platforms`, {
    method: "GET",
  });
};

export const getVote = async (id: string) => {
  return await fetchData<VoteResponse[]>(`${baseUrl}/v1/accounts/${id}/votes`, {
    method: "GET",
  });
};

export const getVotesByCreatorId = async (id: string) => {
  return await fetchData<{ count: number; items: FullVoteResponse[] }>(
    `${baseUrl}/v1/creators/${id}/votes`,
    {
      method: "GET",
    }
  );
};

export const setVote = async (vote: Vote) => {
  return await fetch(`${baseUrl}/v1/votes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      value: vote.value,
      accountId: vote.accountId,
      creatorId: vote.creatorId,
    }),
  });
};

export const deleteVote = async (id: string) => {
  return await fetchData(`${baseUrl}/v1/votes/${id}`, {
    method: "DELETE",
  });
};
