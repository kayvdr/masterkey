import {
  Account,
  AccountBody,
  FullVote,
  Pagination,
  Platform,
  Response,
  Vote,
  VoteBody,
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

  return await fetchData<Response<Account[]>>(url, {
    method: "GET",
  });
};

export const getAccount = async (id: string) => {
  return await fetchData<Account>(`${baseUrl}/v1/accounts/${id}`, {
    method: "GET",
  });
};

export const getAccountsByCreatorId = async (id: string) => {
  return await fetchData<Response<Account[]>>(
    `${baseUrl}/v1/creators/${id}/accounts`,
    {
      method: "GET",
    }
  );
};

export const setAccount = async (account: AccountBody) => {
  return await fetch(`${baseUrl}/v1/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: account.username,
      password: account.password,
      platformId: account.platformId,
      creatorId: account.creatorId,
    }),
  });
};

export const updateAccount = async (id: string, body: AccountBody) => {
  return await fetch(`${baseUrl}/v1/accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: body.username,
      password: body.password,
      platformId: body.platformId,
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
  return await fetchData<Vote[]>(`${baseUrl}/v1/accounts/${id}/votes`, {
    method: "GET",
  });
};

export const getVotesByCreatorId = async (id: string) => {
  return await fetchData<Response<FullVote[]>>(
    `${baseUrl}/v1/creators/${id}/votes`,
    {
      method: "GET",
    }
  );
};

export const setVote = async (vote: VoteBody) => {
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
