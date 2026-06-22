import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const users = client.db("main").collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Cet email est déjà utilisé." },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await users.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return NextResponse.json(
    { message: "Compte créé avec succès." },
    { status: 201 },
  );
}
