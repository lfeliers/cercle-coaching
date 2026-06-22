import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import crypto from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL!));
  }

  const state = crypto.randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    client_id: process.env.NOLIO_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.NOLIO_REDIRECT_URI!,
    state,
  });

  const res = NextResponse.redirect(
    `https://www.nolio.io/api/authorize/?${params.toString()}`,
  );

  res.cookies.set("nolio_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 min — durée de vie du code OAuth Nolio
    path: "/",
  });

  return res;
}
