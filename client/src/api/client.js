// All HTTP calls live here, so components never touch fetch() directly.
const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "claimsmart_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Can't reach the server. Is the API running?", 0);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // No JSON {error} body usually means something other than our API answered (wrong port, proxy, etc.).
    const fallback = `Unexpected response from the server (HTTP ${res.status}). Check that the API is running and the port matches vite.config.js.`;
    throw new ApiError(data?.error || fallback, res.status);
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me"),
  getCars: () => request("/cars"),
  calculate: (body) => request("/calculate", { method: "POST", body }),
  getHistory: () => request("/history"),
  getHistoryItem: (id) => request(`/history/${id}`),
  deleteHistoryItem: (id) => request(`/history/${id}`, { method: "DELETE" }),
  clearHistory: () => request("/history", { method: "DELETE" }),
};
