import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getNolioUser, nolioFetch } from "@/lib/nolio";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const nolio = await getNolioUser(session.userId);
  if (!nolio) {
    // Debug: inspecte le document user pour comprendre pourquoi getNolioUser retourne null
    const { default: clientPromise } = await import("@/lib/mongodb");
    const { ObjectId } = await import("mongodb");
    const client = await clientPromise;
    const user = await client.db("main").collection("users").findOne({ _id: new ObjectId(session.userId) });
    console.error("[nolio/athletes] getNolioUser null. user.nolio =", JSON.stringify(user?.nolio ?? null));
    return NextResponse.json({
      error: "Compte Nolio non connecté.",
      debug: { nolio: user?.nolio ?? null },
    }, { status: 403 });
  }

  const res = await nolioFetch(
    session.userId,
    nolio.accessToken,
    nolio.refreshToken,
    "https://www.nolio.io/api/get/athletes/?wants_coach=false",
  );

  if (!res) return NextResponse.json({ error: "Session Nolio expirée, reconnecte ton compte." }, { status: 401 });
  if (!res.ok) {
    const text = await res.text();
    console.error("[nolio/athletes] Nolio error", res.status, res.statusText, text);
    return NextResponse.json({
      error: `Erreur Nolio : ${text}`,
      debug: { status: res.status, statusText: res.statusText, body: text },
    }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
