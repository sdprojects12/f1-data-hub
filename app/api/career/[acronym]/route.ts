import { NextResponse } from "next/server";

const DRIVER_ID_MAP: Record<string, string> = {
  NOR: "norris",
  VER: "max_verstappen",
  HAM: "hamilton",
  LEC: "leclerc",
  SAI: "sainz",
  RUS: "russell",
  PIA: "piastri",
  ALO: "alonso",
  STR: "stroll",
  OCO: "ocon",
  GAS: "gasly",
  ALB: "albon",
  BOT: "bottas",
  ZHO: "zhou",
  MAG: "kevin_magnussen",
  HUL: "hulkenberg",
  TSU: "tsunoda",
  RIC: "ricciardo",
  LAW: "lawson",
  BEA: "bearman",
  ANT: "antonelli",
  BOR: "bortoleto",
  HAD: "hadjar",
  DOO: "doohan",
  COL: "colapinto",
  LIN: "lindblad",
  PER: "perez",
};
// Fetches all races for a driver in a single request by setting limit=1000
async function fetchAllRaces(url: string): Promise<{ Results: { position: string }[] }[]> {
  try {
    const res = await fetch(`${url}&limit=1000`);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races ?? [];
  } catch {
    return [];
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ acronym: string }> }
) {
  const { acronym } = await params;
  const driverId = DRIVER_ID_MAP[acronym.toUpperCase()];

  if (!driverId) {
    return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  }

  const base = "https://api.jolpi.ca/ergast/f1";

  try {
    // Fetch wins total, all races, and standings dynamically
    const [winsRes, allRaces, standingsRes] = await Promise.all([
      fetch(`${base}/drivers/${driverId}/results/1.json?limit=1`),
      fetchAllRaces(`${base}/drivers/${driverId}/results.json?`),
      fetch(`${base}/drivers/${driverId}/driverStandings.json?limit=100`),
    ]);

    if (!winsRes.ok) {
      return NextResponse.json({ error: "Jolpica fetch failed" }, { status: 500 });
    }

    const winsData = await winsRes.json();
    const wins = parseInt(winsData?.MRData?.total ?? "0");
    const races = allRaces.length;

    const podiums = allRaces.filter((race) => {
      const pos = parseInt(race?.Results?.[0]?.position ?? "99");
      return pos >= 1 && pos <= 3;
    }).length;

    let championships = 0;
    if (standingsRes.ok) {
      const standingsData = await standingsRes.json();
      const lists =
        standingsData?.MRData?.StandingsTable?.StandingsLists ?? [];
      championships = lists.filter(
        (list: { DriverStandings?: { position?: string }[] }) =>
          list.DriverStandings?.[0]?.position === "1"
      ).length;
    }

    console.log(`${driverId}: races=${races}, wins=${wins}, podiums=${podiums}, championships=${championships}`);

    return NextResponse.json({ wins, podiums, championships, races });
  } catch (err) {
    console.error("Career route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}