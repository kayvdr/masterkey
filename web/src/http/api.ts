import { Pagination, User } from "../types";

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
    searchParams.set("q", pagination.q);
    searchParams.set("limit", String(pagination.limit));
    searchParams.set("page", String(pagination.page));
    searchParams.set("sort", String(pagination.sort));
    searchParams.set("order", String(pagination.order));

    url = `${url}?${searchParams.toString()}`;
  }

  return await fetchData<User[]>(url, {
    method: "GET",
  });
};

export const setUser = async (user: User) => {
  return await fetchData<User>(`${baseUrl}/v1/users`, {
    method: "POST",
    body: JSON.stringify({ user }),
    // body: JSON.stringify({
    //   username: user.username,
    //   password: user.password,
    //   votes_up: user.votes_up,
    //   votes_down: user.votes_down,
    //   platform_id: user.platform_id,
    // }),
  });
};

export const getUser = async (id: string) => {
  return await fetchData<User>(`${baseUrl}/v1/users/${id}`, {
    method: "GET",
  });
};

export const patchUser = async (user: User) => {
  return await fetchData<User>(`${baseUrl}/v1/users/${user.id}`, {
    method: "POST",
    body: JSON.stringify({ user }),
  });
};

export const deleteUser = async (id: string) => {
  return await fetchData(`${baseUrl}/v1/users/${id}`, {
    method: "DELETE",
  });
};
