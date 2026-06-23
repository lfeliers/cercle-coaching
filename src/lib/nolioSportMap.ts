export const SPORT_MAP: Record<string, number> = {
  "NAT": 19,     // Swimming
  "VELO": 14,    // Road cycling
  "CAP": 2,      // Running
  "PP - SC": 20, // Strength
  "DIV": 12,     // Other
};

export type NolioPlannedTraining = {
  id_partner: string;
  sport_id: number;
  name: string;
  date_start: string;
  duration: number | null;
  rpe: number | null;
  distance: number | null;
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
      if (!s.date) continue;
      result.push({
        id_partner: `${athlete.athlete_id}-${s.date}-${s.sport}`,
        sport_id: SPORT_MAP[s.sport] ?? 12,
        name: s.name,
        date_start: s.date,
        duration: s.duration ? durationToSeconds(s.duration) : null,
        rpe: s.rpe,
        distance: s.distance_km,
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
