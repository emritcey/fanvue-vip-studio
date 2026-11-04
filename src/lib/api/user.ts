import { env } from "@/env";
import { getSession, setSession } from "@/lib/session";
import { refreshAccessToken } from "@/lib/oauth";
import { topSpendersSeed } from "@/lib/seeds/topSpenders";
import type { TopSpendersResponse } from "@/types/topSpender";
import { getFanvueHeaders } from "./headers";

export async function getCurrentUser() {
  let session = await getSession();
  if (!session) return null;

  if (Date.now() >= session.expiresAt - 30_000 && session.refreshToken) {
    try {
      const refreshed = await refreshAccessToken(session.refreshToken);
      const updatedSession = {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token ?? session.refreshToken,
        tokenType: refreshed.token_type,
        scope: refreshed.scope ?? session.scope,
        expiresAt: Date.now() + refreshed.expires_in * 1000,
      };
      await setSession(updatedSession);
      session = updatedSession;
    } catch { }
  }

  try {
    const res = await fetch(`${env.API_BASE_URL}/users/me`, {
      headers: getFanvueHeaders(session.accessToken),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

// returns topSpendersSeed for demo purposes
export async function getTopSpenders(): Promise<TopSpendersResponse> {
  const session = await getSession();
  if (!session) return topSpendersSeed;

  const now = new Date();
  const startDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
  const endDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  ).toISOString();

  try {
    const params = new URLSearchParams({ startDate, endDate });
    const res = await fetch(`${env.API_BASE_URL}/top-spenders?${params}`, {
      headers: getFanvueHeaders(session.accessToken),
      cache: "no-store",
    });

    if (!res.ok) return topSpendersSeed;

    const payload = (await res.json()) as TopSpendersResponse;
    if (!payload?.data?.length) return topSpendersSeed;

    return payload;
  } catch {
    return topSpendersSeed;
  }
}
