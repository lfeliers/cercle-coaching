import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { createSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  const client = await clientPromise;
  const users = client.db("main").collection("users");

  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const res = NextResponse.json({
    message: "Connexion réussie.",
    user: { id: user._id, name: user.name, email: user.email },
  });

  return createSessionCookie(
    { userId: user._id.toString(), name: user.name, email: user.email },
    res,
  );
}
