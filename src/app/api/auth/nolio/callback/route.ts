import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL!));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = req.cookies.get("nolio_oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL("/home?error=oauth", process.env.NEXTAUTH_URL!));
  }

  // Échanger le code contre les tokens
  const tokenRes = await fetch("https://www.nolio.io/api/token/", {
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
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NOLIO_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/home?error=token", process.env.NEXTAUTH_URL!));
  }

  const { access_token, refresh_token } = await tokenRes.json();

  // Récupérer le profil Nolio pour obtenir l'id utilisateur
  const profileRes = await fetch("https://www.nolio.io/api/get/user/", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    return NextResponse.redirect(new URL("/home?error=profile", process.env.NEXTAUTH_URL!));
  }

  const profile = await profileRes.json();

  // Stocker les tokens et l'id Nolio dans le document user
  const client = await clientPromise;
  await client
    .db("main")
    .collection("users")
    .updateOne(
      { _id: new ObjectId(session.userId) },
      {
        $set: {
          nolio: {
            connected: true,
            accessToken: access_token,
            refreshToken: refresh_token,
            nolioUserId: profile.id ?? profile.user_id ?? null,
            connectedAt: new Date(),
          },
        },
      },
    );

  const res = NextResponse.redirect(new URL("/home", process.env.NEXTAUTH_URL!));
  res.cookies.set("nolio_oauth_state", "", { maxAge: 0, path: "/" });
  return res;
}
