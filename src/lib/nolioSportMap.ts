export const SPORT_MAP: Record<string, number> = {
  "NAT": 19,     // Swimming
  "VELO": 14,    // Road cycling
  "CAP": 2,      // Running
  "PP - SC": 20, // Strength
};

const IGNORED_SPORTS = new Set(["DIV"]);

export type NolioPlannedTraining = {
  id_partner: number;
  sport_id: number;
  name: string;
  date_start: string;
  duration?: number;
  rpe?: number;
  distance?: number;
  athlete_id: number;
};

export function toNolioTrainings(athletes: {
  athlete_id: number;
  sessions: {
    date: string | null;
    sport: string;
    name: string;
    duration: string | null;
    distance_km: number | null;
    rpe: number | null;
  }[];
}[]): NolioPlannedTraining[] {
  const result: NolioPlannedTraining[] = [];

  for (const athlete of athletes) {
    for (const s of athlete.sessions) {
      if (!s.date || IGNORED_SPORTS.has(s.sport)) continue;
      const sport_id = SPORT_MAP[s.sport] ?? 12;
      // id_partner doit être un entier unique : athlete_id + YYYYMMDD + sport_id
      const dateCompact = s.date.replace(/-/g, "");
      const id_partner = parseInt(`${athlete.athlete_id}${dateCompact}${String(sport_id).padStart(2, "0")}`);
      result.push({
        id_partner,
        sport_id,
        name: s.name,
        date_start: s.date,
        ...(s.duration ? { duration: durationToSeconds(s.duration) } : {}),
        ...(s.rpe != null ? { rpe: s.rpe } : {}),
        ...(s.distance_km != null ? { distance: Math.round(s.distance_km) } : {}),
        athlete_id: athlete.athlete_id,
      });
    }
  }

  return result;
}

function durationToSeconds(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h * 60 + m) * 60;
}
