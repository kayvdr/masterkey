import {
  FullUserResponse,
  Pagination,
  Platform,
  User,
  UserResponse,
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

export const getUsers = async (pagination?: Pagination) => {
  let url = `${baseUrl}/v1/users`;

  if (pagination) {
    const searchParams = new URLSearchParams();
    pagination.q && searchParams.set("q", pagination.q);
    searchParams.set("limit", String(pagination.limit));
    searchParams.set("page", String(pagination.page));
    pagination.sort && searchParams.set("sort", String(pagination.sort));
    pagination.sort && searchParams.set("order", String(pagination.order));

    url = `${url}?${searchParams.toString()}`;
  }

  return await fetchData<{ count: number; items: FullUserResponse[] }>(url, {
    method: "GET",
  });
};

export const getUsersByCreatorId = async (id: string) => {
  return await fetchData<{ count: number; items: FullUserResponse[] }>(
    `${baseUrl}/v1/creators/${id}/users`,
    {
      method: "GET",
    }
  );
};

export const setUser = async (user: User) => {
  return await fetch(`${baseUrl}/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.username,
      password: user.password,
      votes_up: user.votesUp ?? 0,
      votes_down: user.votesDown ?? 0,
      platform_id: user.platform.id,
      created_by: user.createdBy,
    }),
  });
};

export const getUser = async (id: string) => {
  return await fetchData<UserResponse>(`${baseUrl}/v1/users/${id}`, {
    method: "GET",
  });
};

export const patchUser = async (user: User) => {
  return await fetch(`${baseUrl}/v1/users/${user.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.username,
      password: user.password,
      votes_up: user.votesUp ?? 0,
      votes_down: user.votesDown ?? 0,
      platform_id: user.platform.id,
    }),
  });
};

export const deleteUser = async (id: string) => {
  return await fetchData(`${baseUrl}/v1/users/${id}`, {
    method: "DELETE",
  });
};

export const getPlatforms = async () => {
  return await fetchData<Platform[]>(`${baseUrl}/v1/platforms`, {
    method: "GET",
  });
};
