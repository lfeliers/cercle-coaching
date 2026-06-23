import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getSession } from "@/lib/session";

const SPORTS = ["NAT", "VELO", "CAP", "PP - SC", "DIV"] as const;
const SPORT_OFFSETS = [3, 4, 5, 6, 7];
const DAY_START_COL = 6;
const DAY_COUNT = 7;

function fmtTime(val: unknown): string | null {
  if (val instanceof Date) {
    const h = val.getUTCHours();
    const m = val.getUTCMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return null;
}

function fmtDate(val: unknown): string | null {
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return null;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });

  const ws = wb.Sheets["Pprog"];
  if (!ws) return NextResponse.json({ error: 'Feuille "Pprog" introuvable.' }, { status: 400 });

  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

  const results = [];
  let i = 0;

  while (i < rows.length) {
    const row = rows[i];
    const athleteId = row?.[0];

    if (typeof athleteId !== "number") { i++; continue; }

    const weekRaw = rows[i + 1]?.[1];
    const week = typeof weekRaw === "number" ? Math.round(weekRaw) : null;
    const dates = Array.from({ length: DAY_COUNT }, (_, d) =>
      fmtDate(row[DAY_START_COL + d * 4])
    );

    const sessions = [];
    for (let s = 0; s < SPORTS.length; s++) {
      const sportRow = rows[i + SPORT_OFFSETS[s]];
      if (!sportRow) continue;
      for (let d = 0; d < DAY_COUNT; d++) {
        const base = DAY_START_COL + d * 4;
        const name = sportRow[base];
        if (!name || name === "pas") continue;
        const duration = fmtTime(sportRow[base + 1]);
        const distRaw = sportRow[base + 2];
        const rpeRaw = sportRow[base + 3];
        sessions.push({
          date: dates[d],
          sport: SPORTS[s],
          name: String(name).trim(),
          duration,
          distance_km: typeof distRaw === "number" ? distRaw : null,
          rpe: typeof rpeRaw === "number" ? Math.round(rpeRaw) : null,
        });
      }
    }

    results.push({ athlete_id: Math.round(athleteId), week, sessions });
    i += 8;
  }

  return NextResponse.json(results);
}
