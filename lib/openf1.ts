import { Driver, Race } from "@/types/f1";

const BASE_URL = "https://api.openf1.org/v1";
export const DRIVER_IMAGES: Record<number, string> = {
  1:  "/drivers/1.png",
  3:  "/drivers/3.png",
  5:  "/drivers/5.png",
  6:  "/drivers/6.png",
  7:  "/drivers/7.png",
  10: "/drivers/10.png",
  11: "/drivers/11.png",
  12: "/drivers/12.png",
  14: "/drivers/14.png",
  16: "/drivers/16.png",
  18: "/drivers/18.png",
  22: "/drivers/22.png",
  23: "/drivers/23.png",
  27: "/drivers/27.png",
  30: "/drivers/30.png",
  31: "/drivers/31.png",
  38: "/drivers/38.png",
  41: "/drivers/41.png",
  43: "/drivers/43.png",
  44: "/drivers/44.png",
  55: "/drivers/55.png",
  63: "/drivers/63.png",
  77: "/drivers/77.png",
  81: "/drivers/81.png",
  87: "/drivers/87.png",
  94: "/drivers/94.png",
};

// 2025 Constructors Championship order (used for sorting drivers)
export const TEAM_ORDER: Record<string, number> = {
  "McLaren":           1,
  "Ferrari":           2,
  "Red Bull Racing":   3,
  "Mercedes":          4,
  "Aston Martin":      5,
  "Alpine":            6,
  "Haas F1 Team":      7,
  "Racing Bulls":      8,
  "Williams":          9,
  "Kick Sauber":       10,
  "Audi":              11,
  "Cadillac":          12,
};

// The drivers endpoint requires a session_key — it doesn't accept just a year.
// So we first fetch the last race session of that year, then get drivers from it.
export async function getDrivers(year: number = 2026): Promise<Driver[]> {
  try {
    // Step 1: Get all race sessions for that year
    const sessionsRes = await fetch(
      `${BASE_URL}/sessions?year=${year}&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!sessionsRes.ok) return [];

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return [];

    // Step 2: Use the last race session of the year
    const lastSession = sessions[sessions.length - 1];

    // Step 3: Get all drivers from that session
    const driversRes = await fetch(
      `${BASE_URL}/drivers?session_key=${lastSession.session_key}`,
      { next: { revalidate: 3600 } }
    );
    if (!driversRes.ok) return [];

    const data: Driver[] = await driversRes.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch drivers:", err);
    return [];
  }
}

export async function getDriverByNumber(
  driverNumber: number
): Promise<Driver | null> {
  try {
    // Get from the last 2026 race session
    const sessionsRes = await fetch(
      `${BASE_URL}/sessions?year=2026&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!sessionsRes.ok) return null;

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return null;

    const lastSession = sessions[sessions.length - 1];

    const res = await fetch(
      `${BASE_URL}/drivers?driver_number=${driverNumber}&session_key=${lastSession.session_key}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data: Driver[] = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getRaces(year: number = 2026): Promise<Race[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/sessions?year=${year}&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const data: Race[] = await res.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "OPENF1_RESTRICTED") throw err;
    return [];
  }
}

function buildOpenF1ProxyUrl(
  path: string,
  params: Record<string, string | number | undefined>
): string {
  const searchParams = new URLSearchParams({ path });
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });
  return `/api/openf1?${searchParams.toString()}`;
}

// Get a driver's best lap time from their most recent race
export async function getDriverBestLap(
  driverNumber: number,
  sessionKey: number
): Promise<number | null> {
  try {
    const res = await fetch(
      buildOpenF1ProxyUrl("laps", {
        session_key: sessionKey,
        driver_number: driverNumber,
      })
    );
    if (!res.ok) return null;

    const laps: { lap_duration: number | null; is_pit_out_lap: boolean }[] =
      await res.json();

    // Filter out pit out laps and nulls, then find the fastest
    const valid = laps
      .filter((l) => l.lap_duration !== null && !l.is_pit_out_lap)
      .map((l) => l.lap_duration as number);

    if (valid.length === 0) return null;
    return Math.min(...valid);
  } catch {
    return null;
  }
}

export async function getDriverCareerStats(nameAcronym: string): Promise<{
  wins: number;
  podiums: number;
  championships: number;
  races: number;
} | null> {
  try {
    const res = await fetch(`/api/career/${nameAcronym}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Client-safe version — no Next.js cache options
export async function getDriversClient(year: number = 2026): Promise<Driver[]> {
  try {
    const sessionsRes = await fetch(
      buildOpenF1ProxyUrl("sessions", {
        year,
        session_type: "Race",
      })
    );
    if (sessionsRes.status === 401) throw new Error("OPENF1_RESTRICTED");
    if (!sessionsRes.ok) return [];

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return [];

    const lastSession = sessions[sessions.length - 1];

    const driversRes = await fetch(
      buildOpenF1ProxyUrl("drivers", {
        session_key: lastSession.session_key,
      })
    );
    if (driversRes.status === 401) throw new Error("OPENF1_RESTRICTED");
    if (!driversRes.ok) return [];

    return await driversRes.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "OPENF1_RESTRICTED") throw err;
    return [];
  }
}

export async function getRacesClient(year: number = 2026): Promise<Race[]> {
  try {
    const res = await fetch(
      buildOpenF1ProxyUrl("sessions", {
        year,
        session_type: "Race",
      })
    );
    if (res.status === 401) throw new Error("OPENF1_RESTRICTED");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getSeasonRaces(year: number): Promise<{
  round: string;
  raceName: string;
  Circuit: { circuitName: string; Location: { country: string; locality: string } };
  date: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/races.json?limit=100`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races ?? [];
  } catch {
    return [];
  }
}

export async function getRaceResults(year: number, round: string): Promise<{
  position: string;
  Driver: { givenName: string; familyName: string; nationality: string };
  Constructor: { name: string };
  Time?: { time: string };
  FastestLap?: { rank: string; Time: { time: string } };
  grid: string;
  points: string;
  status: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0]?.Results ?? [];
  } catch {
    return [];
  }
}