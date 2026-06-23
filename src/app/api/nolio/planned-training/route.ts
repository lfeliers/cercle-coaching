import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getNolioUser, nolioFetch } from "@/lib/nolio";
import type { NolioPlannedTraining } from "@/lib/nolioSportMap";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const nolio = await getNolioUser(session.userId);
  if (!nolio) return NextResponse.json({ error: "Compte Nolio non connecté." }, { status: 403 });

  const trainings: NolioPlannedTraining[] = await req.json();

  const results = [];
  for (const training of trainings) {
    const res = await nolioFetch(
      session.userId,
      nolio.accessToken,
      nolio.refreshToken,
      "https://www.nolio.io/api/create/planned/training/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(training),
      },
    );

    if (!res) {
      results.push({ id_partner: training.id_partner, status: "error", error: "Token invalide." });
      continue;
    }

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await res.json() : await res.text();

    results.push({
      id_partner: training.id_partner,
      status: res.ok ? "ok" : "error",
      ...(res.ok ? { data: body } : { error: body }),
    });
  }

  const errors = results.filter((r) => r.status === "error");
  return NextResponse.json({
    total: results.length,
    success: results.length - errors.length,
    errors: errors.length,
    results,
  });
}
