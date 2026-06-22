import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const client = await clientPromise;
  const user = await client
    .db("main")
    .collection("users")
    .findOne({ _id: new ObjectId(session.userId) });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    nolio: {
      connected: user.nolio?.connected ?? false,
      nolioUserId: user.nolio?.nolioUserId ?? null,
      connectedAt: user.nolio?.connectedAt ?? null,
    },
  });
}
