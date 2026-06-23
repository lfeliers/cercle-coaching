import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getNolioUser, nolioFetch } from "@/lib/nolio";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const nolio = await getNolioUser(session.userId);
  if (!nolio) return NextResponse.json({ error: "Compte Nolio non connecté." }, { status: 403 });

  const res = await nolioFetch(
    session.userId,
    nolio.accessToken,
    nolio.refreshToken,
    "https://www.nolio.io/api/get/athletes/?wants_coach=false",
  );

  if (!res) return NextResponse.json({ error: "Session Nolio expirée, reconnecte ton compte." }, { status: 401 });
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `Erreur Nolio (${res.status}) : ${text || res.statusText}` }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
