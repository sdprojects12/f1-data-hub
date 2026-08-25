import { Driver, Race } from "@/types/f1";

const BASE_URL = "https://api.openf1.org/v1";

// 2025 Constructors Championship order
export const TEAM_ORDER: Record<string, number> = {
  "McLaren": 1,
  "Ferrari": 2,
  "Red Bull Racing": 3,
  "Mercedes": 4,
  "Aston Martin": 5,
  "Alpine": 6,
  "Haas F1 Team": 7,
  "Racing Bulls": 8,
  "Williams": 9,
  "Kick Sauber": 10,
  "Audi": 11,
  "Cadillac": 12,
};

// Local overrides for drivers whose API headshots are missing or outdated
export const HEADSHOT_OVERRIDES: Record<number, string> = {
  5:  "/drivers/5.png",   // Bortoleto — multiviewer 2026 (Audi outfit)
  6:  "/drivers/6.png",   // Hadjar — multiviewer 2026 (Red Bull outfit)
  11: "/drivers/11.png",  // Perez — multiviewer 2026 (Cadillac outfit)
  27: "/drivers/27.png",  // Hulkenberg — multiviewer 2026 (Audi outfit)
  31: "/drivers/31.png",  // Ocon — multiviewer 2026 (Haas outfit)
  38: "/drivers/38.png",  // Bearman — multiviewer 2026 (Haas outfit)
  41: "/drivers/41.png",  // Lindblad — multiviewer 2026 (F1.com has no image)
  77: "/drivers/77.png",  // Bottas — multiviewer 2026 (Cadillac outfit)
};

// Resolve driver headshot: local override > API URL (upgraded to retina)
export function resolveHeadshot(url: string | null, driverNumber: number): string | null {
  if (HEADSHOT_OVERRIDES[driverNumber]) return HEADSHOT_OVERRIDES[driverNumber];
  return getHeadshotUrl(url);
}

// Upgrade API headshot URLs to high-res 2col-retina and strip tracking prefix
export function getHeadshotUrl(url: string | null): string | null {
  if (!url) return null;
  // Strip the tracking pixel prefix if present
  let clean = url.replace(
    "https://media.formula1.com/d_driver_fallback_image.png/content/dam",
    "https://media.formula1.com/content/dam"
  );
  // Upgrade 1col → 2col-retina for higher resolution
  clean = clean.replace("/1col/image.png", "/2col-retina/image.png");
  return clean;
}

// Waits a given number of milliseconds
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



// Server-side driver fetch (uses Next.js cache)
export async function getDrivers(year: number = 2026): Promise<Driver[]> {
  try {
    const sessionsRes = await fetch(
      `${BASE_URL}/sessions?year=${year}&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!sessionsRes.ok) return [];

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return [];

    const lastSession = sessions[sessions.length - 1];

    const driversRes = await fetch(
      `${BASE_URL}/drivers?session_key=${lastSession.session_key}`,
      { next: { revalidate: 3600 } }
    );
    if (!driversRes.ok) return [];

    const data: Driver[] = await driversRes.json();
    const seen = new Set<number>();
    return data.filter((driver) => {
      if (!driver.driver_number) return false;
      if (seen.has(driver.driver_number)) return false;
      seen.add(driver.driver_number);
      return true;
    });
  } catch {
    return [];
  }
}

// Client-safe version — no Next.js cache options
// Client-safe version — routes through our proxy to avoid CORS
export async function getDriversClient(year: number = 2026): Promise<Driver[]> {
  try {
    const sessionsRes = await fetch(
      `/api/openf1?path=sessions&year=${year}&session_type=Race`
    );
    if (sessionsRes.status === 401) throw new Error("OPENF1_RESTRICTED");
    if (!sessionsRes.ok) return [];

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return [];

    const lastSession = sessions[sessions.length - 1];

    await sleep(1000); // Small delay to reduce chance of hitting rate limits

    const driversRes = await fetch(
      `/api/openf1?path=drivers&session_key=${lastSession.session_key}`
    );
    if (driversRes.status === 401) throw new Error("OPENF1_RESTRICTED");
    if (!driversRes.ok) return [];

    const data: Driver[] = await driversRes.json();
    const seen = new Set<number>();
    return data.filter((driver) => {
      if (!driver.driver_number) return false;
      if (seen.has(driver.driver_number)) return false;
      seen.add(driver.driver_number);
      return true;
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "OPENF1_RESTRICTED") throw err;
    return [];
  }
}

export async function getDriverByNumber(
  driverNumber: number
): Promise<Driver | null> {
  try {
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
    return await res.json();
  } catch {
    return [];
  }
}

export async function getRacesClient(year: number = 2026): Promise<Race[]> {
  try {
    const res = await fetch(
      `/api/openf1?path=sessions&year=${year}&session_type=Race`
    );
    if (res.status === 401) throw new Error("OPENF1_RESTRICTED");
    if (!res.ok) return [];
    return await res.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "OPENF1_RESTRICTED") throw err;
    return [];
  }
}

export async function getDriverBestLap(
  driverNumber: number,
  sessionKey: number
): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/laps?session_key=${sessionKey}&driver_number=${driverNumber}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const laps: { lap_duration: number | null; is_pit_out_lap: boolean }[] =
      await res.json();

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

function getCacheOptions(year: number): RequestInit {
  const currentYear = new Date().getFullYear();
  if (year < currentYear) {
    // Indefinite/very long caching for historical seasons
    return { next: { revalidate: 31536000 } }; // 1 year
  }
  // 1 hour caching for active/current/future seasons
  return { next: { revalidate: 3600 } };
}

export async function getSeasonRaces(year: number): Promise<{
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: { country: string; locality: string };
  };
  date: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/races.json?limit=100`,
      getCacheOptions(year)
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races ?? [];
  } catch {
    return [];
  }
}

export async function getRaceResults(
  year: number,
  round: string
): Promise<{
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
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`,
      getCacheOptions(year)
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0]?.Results ?? [];
  } catch {
    return [];
  }
}

export async function getDriverStandings(year: number): Promise<{
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    permanentNumber?: string;
  };
  Constructors: { name: string; constructorId: string }[];
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json?limit=100`,
      getCacheOptions(year)
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  } catch {
    return [];
  }
}

export async function getConstructorStandings(year: number): Promise<{
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json?limit=100`,
      getCacheOptions(year)
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
  } catch {
    return [];
  }
}

export async function getQualifyingResults(
  year: number,
  round: string
): Promise<{
  position: string;
  Driver: { givenName: string; familyName: string; nationality: string };
  Constructor: { name: string };
  Q1: string;
  Q2: string;
  Q3: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying.json`,
      getCacheOptions(year)
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults ?? [];
  } catch {
    return [];
  }
}