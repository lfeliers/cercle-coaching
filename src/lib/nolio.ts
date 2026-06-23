import { Collection, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

type NolioTokens = {
  accessToken: string;
  refreshToken: string;
};

async function refreshNolioTokens(userId: string, refreshToken: string): Promise<NolioTokens | null> {
  const res = await fetch("https://www.nolio.io/api/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.NOLIO_CLIENT_ID}:${process.env.NOLIO_CLIENT_SECRET}`,
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null; // refresh_token révoqué ou invalide → refaire le flow OAuth complet

  const { access_token, refresh_token: new_refresh_token } = await res.json();

  const client = await clientPromise;
  await client
    .db("main")
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { "nolio.accessToken": access_token, "nolio.refreshToken": new_refresh_token } },
    );

  return { accessToken: access_token, refreshToken: new_refresh_token };
}

/**
 * Appelle l'API Nolio avec retry automatique sur 401 (refresh du token).
 * Renvoie null si le refresh échoue (token révoqué → flow OAuth à refaire).
 */
export async function nolioFetch(
  userId: string,
  accessToken: string,
  refreshToken: string,
  url: string,
  options: RequestInit = {},
): Promise<Response | null> {
  let token = accessToken;

  let res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    const refreshed = await refreshNolioTokens(userId, refreshToken);
    if (!refreshed) return null; // refresh échoué

    token = refreshed.accessToken;
    res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  }

  return res;
}

export async function getNolioUser(userId: string) {
  const client = await clientPromise;
  const user = await client
    .db("main")
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });

  if (!user?.nolio?.connected || !user.nolio.accessToken) return null;

  return {
    accessToken: user.nolio.accessToken as string,
    refreshToken: user.nolio.refreshToken as string,
  };
}
