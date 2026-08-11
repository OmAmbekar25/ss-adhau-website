/**
 * Minimal Aimfox API client.
 *
 * Auth: Bearer API key (create one on the Aimfox Integrations page).
 * Base URL: https://api.aimfox.com/api/v2
 * Rate limit: 60 requests/minute — 429 responses are retried once after the
 * server-indicated delay (Retry-After) or 5s.
 */

const DEFAULT_BASE_URL = "https://api.aimfox.com/api/v2";

export class AimfoxError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "AimfoxError";
    this.status = status;
    this.body = body;
  }
}

export class AimfoxClient {
  constructor({ apiKey, baseUrl = DEFAULT_BASE_URL } = {}) {
    if (!apiKey) {
      throw new Error(
        "Missing Aimfox API key. Set the AIMFOX_API_KEY environment variable.",
      );
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async request(method, path, { query, body } = {}) {
    const url = new URL(this.baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }

    const doFetch = () =>
      fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });

    let response = await doFetch();
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after")) || 5;
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      response = await doFetch();
    }

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new AimfoxError(
        `Aimfox API ${method} ${path} failed with ${response.status}`,
        response.status,
        data,
      );
    }
    return data;
  }

  get(path, query) {
    return this.request("GET", path, { query });
  }

  post(path, body, query) {
    return this.request("POST", path, { body, query });
  }

  patch(path, body) {
    return this.request("PATCH", path, { body });
  }

  delete(path) {
    return this.request("DELETE", path);
  }
}
