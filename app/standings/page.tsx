import { getDriverStandings, getConstructorStandings } from "@/lib/openf1";
import StandingsControls from "@/components/StandingsControls";

const CURRENT_YEAR = 2026;
const MIN_YEAR = 1950;
const years = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

// Nationality to flag emoji
const FLAGS: Record<string, string> = {
  British: "🇬🇧", Dutch: "🇳🇱", Monegasque: "🇲🇨", Spanish: "🇪🇸",
  German: "🇩🇪", French: "🇫🇷", Finnish: "🇫🇮", Australian: "🇦🇺",
  Canadian: "🇨🇦", Mexican: "🇲🇽", Japanese: "🇯🇵", Thai: "🇹🇭",
  Danish: "🇩🇰", Chinese: "🇨🇳", Italian: "🇮🇹", American: "🇺🇸",
  Brazilian: "🇧🇷", Argentine: "🇦🇷", Belgian: "🇧🇪", Polish: "🇵🇱",
  "New Zealander": "🇳🇿", Austrian: "🇦🇹", Portuguese: "🇵🇹",
  Swiss: "🇨🇭", Russian: "🇷🇺", Swedish: "🇸🇪", Hungarian: "🇭🇺",
  South: "🇿🇦",
};

interface PageProps {
  searchParams: Promise<{
    year?: string;
    tab?: string;
  }>;
}

export default async function StandingsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const selectedYear = resolvedParams.year ? Number(resolvedParams.year) : 2025;
  const activeTab = resolvedParams.tab === "constructors" ? "constructors" : "drivers";

  // Fetch standings data on the server side
  const [driverStandings, constructorStandings] = await Promise.all([
    getDriverStandings(selectedYear),
    getConstructorStandings(selectedYear),
  ]);

  const positionColor = (pos: string) => {
    if (pos === "1") return "#F59E0B";
    if (pos === "2") return "#9CA3AF";
    if (pos === "3") return "#C89B3C";
    return "#4B5563";
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          Championship{" "}
          <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Standings
          </span>
        </h1>
        <p className="text-gray-500">
          Driver and constructor standings from every F1 season since 1950.
        </p>
      </div>

      {/* Controls (Season selection & tab switching managed via client-side params) */}
      <StandingsControls
        selectedYear={selectedYear}
        activeTab={activeTab}
        years={years}
      />

      {/* Table */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden">

        {/* Driver Standings */}
        {activeTab === "drivers" && (
          <>
            <div className="grid grid-cols-12 px-5 py-3 text-gray-600 text-xs uppercase tracking-wider border-b border-white/5">
              <span className="col-span-1">Pos</span>
              <span className="col-span-1">No.</span>
              <span className="col-span-4">Driver</span>
              <span className="col-span-3">Team</span>
              <span className="col-span-1 text-center">Wins</span>
              <span className="col-span-2 text-right">Points</span>
            </div>

            {driverStandings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No standings available for {selectedYear}.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {driverStandings.map((standing, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 px-5 py-4 text-sm transition-colors hover:bg-white/2 items-center ${
                      standing.position === "1" ? "bg-yellow-500/3" : ""
                    }`}
                  >
                    {/* Position */}
                    <span
                      className="col-span-1 font-black text-base"
                      style={{ color: positionColor(standing.position) }}
                    >
                      {standing.position}
                    </span>

                    {/* Number */}
                    <span className="col-span-1 text-gray-600 font-mono text-xs">
                      {standing.Driver.permanentNumber ?? "—"}
                    </span>

                    {/* Driver */}
                    <span className="col-span-4 text-white font-semibold flex items-center gap-2">
                      <span className="text-base">
                        {FLAGS[standing.Driver.nationality] ?? "🏁"}
                      </span>
                      {standing.Driver.givenName[0]}. {standing.Driver.familyName}
                    </span>

                    {/* Team */}
                    <span className="col-span-3 text-gray-500 text-xs">
                      {standing.Constructors?.[0]?.name ?? "—"}
                    </span>

                    {/* Wins */}
                    <span className="col-span-1 text-center text-gray-400 font-medium">
                      {standing.wins}
                    </span>

                    {/* Points */}
                    <span className="col-span-2 text-right font-black"
                      style={{ color: standing.position === "1" ? "#F59E0B" : "white" }}
                    >
                      {standing.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Constructor Standings */}
        {activeTab === "constructors" && (
          <>
            <div className="grid grid-cols-12 px-5 py-3 text-gray-600 text-xs uppercase tracking-wider border-b border-white/5">
              <span className="col-span-1">Pos</span>
              <span className="col-span-5">Constructor</span>
              <span className="col-span-3">Nationality</span>
              <span className="col-span-1 text-center">Wins</span>
              <span className="col-span-2 text-right">Points</span>
            </div>

            {constructorStandings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">
                  No constructor standings for {selectedYear}.
                  {selectedYear < 1958 && (
                    <span className="block text-xs mt-1 text-gray-700">
                      Constructor standings began in 1958.
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {constructorStandings.map((standing, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 px-5 py-4 text-sm transition-colors hover:bg-white/2 items-center ${
                      standing.position === "1" ? "bg-yellow-500/3" : ""
                    }`}
                  >
                    {/* Position */}
                    <span
                      className="col-span-1 font-black text-base"
                      style={{ color: positionColor(standing.position) }}
                    >
                      {standing.position}
                    </span>

                    {/* Constructor */}
                    <span className="col-span-5 text-white font-semibold flex items-center gap-2">
                      <span className="text-base">
                        {FLAGS[standing.Constructor.nationality] ?? "🏁"}
                      </span>
                      {standing.Constructor.name}
                    </span>

                    {/* Nationality */}
                    <span className="col-span-3 text-gray-500 text-xs">
                      {standing.Constructor.nationality}
                    </span>

                    {/* Wins */}
                    <span className="col-span-1 text-center text-gray-400 font-medium">
                      {standing.wins}
                    </span>

                    {/* Points */}
                    <span
                      className="col-span-2 text-right font-black"
                      style={{ color: standing.position === "1" ? "#F59E0B" : "white" }}
                    >
                      {standing.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* Note about constructor standings */}
      {activeTab === "constructors" && selectedYear < 1958 && (
        <p className="text-gray-700 text-xs text-center mt-4">
          The Constructors Championship was introduced in 1958.
        </p>
      )}

    </main>
  );
}