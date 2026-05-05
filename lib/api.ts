import { tokenService } from "./token";
import { setAuthNotice } from "./auth-routing";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T = unknown>(
  url: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  await tokenService.waitForInit();
  const token = tokenService.getAccessToken();
  const shouldRefreshOnUnauthorized = !url.startsWith("/auth/login");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (res.status === 401 && retry && shouldRefreshOnUnauthorized) {
    const refreshed = await refreshTokens();

    if (!refreshed) {
      const hadToken = tokenService.getAccessToken();
      if (hadToken) {
        logout("Your session has expired. Please sign in again.");
      }
      throw { status: 401, message: ["Unauthorized"] };
    }

    return request<T>(url, options, false);
  }

  const data: T = await res.json();

  if (!res.ok) {
    const err = data as Record<string, unknown>;
    throw {
      status: res.status,
      message: Array.isArray(err?.message)
        ? err.message
        : [String(err?.message ?? "Something went wrong")],
      code: String(err?.code ?? "ERROR"),
    };
  }

  return data;
}

async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json() as { accessToken: string; refreshToken: string };
    await tokenService.setTokens(data.accessToken, data.refreshToken);

    return true;
  } catch {
    return false;
  }
}

export function logout(message?: string) {
  tokenService.clear();

  if (message) {
    setAuthNotice(message);
  }

  window.location.href = "/";
}

export const api = {
  get: <T = unknown>(url: string) => request<T>(url),
  post: <T = unknown>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T = unknown>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T = unknown>(url: string, body: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T = unknown>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "DELETE",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
};
