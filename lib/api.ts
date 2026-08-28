export type Admin = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ApiOptions = RequestInit & { skipRefresh?: boolean };

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((r) => r.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { skipRefresh, headers, ...rest } = options;
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    ...rest,
  });

  if (res.status === 401 && !skipRefresh) {
    const ok = await tryRefresh();
    if (ok) return api<T>(path, { ...options, skipRefresh: true });
  }

  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
