import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const client = await clientPromise;
  const user = await client
    .db("main")
    .collection("users")
    .findOne({ _id: new ObjectId(session.userId) });

  if (!user?.nolio?.connected || !user.nolio.accessToken) {
    return NextResponse.json({ error: "Compte Nolio non connecté." }, { status: 403 });
  }

  const res = await fetch("https://www.nolio.io/api/get/athletes/?wants_coach=false", {
    headers: { Authorization: `Bearer ${user.nolio.accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: `Erreur Nolio : ${text}` }, { status: res.status });
  }

  const athletes = await res.json();
  return NextResponse.json(athletes);
}
