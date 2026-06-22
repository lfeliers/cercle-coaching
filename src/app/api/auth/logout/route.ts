import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Déconnecté." });
  res.cookies.set("session", "", { maxAge: 0, path: "/" });
  return res;
}
