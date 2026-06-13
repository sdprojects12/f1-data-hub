"use client";

import { useState, useEffect } from "react";
import { getSeasonRaces, getRaceResults } from "@/lib/openf1";

type Race = {
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: { country: string; locality: string };
  };
  date: string;
};

type Result = {
  position: string;
  Driver: { givenName: string; familyName: string };
  Constructor: { name: string };
  Time?: { time: string };
  FastestLap?: { rank: string; Time: { time: string } };
  grid: string;
  points: string;
  status: string;
};

const CURRENT_YEAR = 2026;
const MIN_YEAR = 1950;
const years = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

export default function RacesPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingRaces(true);
      setRaces([]);
      setSelectedRace(null);
      setResults([]);
      const data = await getSeasonRaces(selectedYear);
      setRaces(data);
      setLoadingRaces(false);
    };
    load();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedRace) return;
    const load = async () => {
      setLoadingResults(true);
      setResults([]);
      const data = await getRaceResults(selectedYear, selectedRace.round);
      setResults(data);
      setLoadingResults(false);
    };
    load();
  }, [selectedRace, selectedYear]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          Race{" "}
          <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Archive
          </span>
        </h1>
        <p className="text-gray-500">
          Browse race results from every Formula 1 season since 1950.
        </p>
      </div>

      {/* Year selector */}
      <div className="mb-8">
        <label className="text-gray-600 text-xs uppercase tracking-widest mb-2 block">
          Season
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#0d0d0d] border border-white/10 focus:border-white/30 text-white rounded-lg px-4 py-2.5 outline-none transition-colors text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y} Season
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Race list */}
        <div className="lg:col-span-1">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">
            {selectedYear} Rounds
            {races.length > 0 && (
              <span className="ml-2 text-gray-700">({races.length})</span>
            )}
          </p>

          {loadingRaces ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-14 bg-[#0d0d0d] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : races.length === 0 ? (
            <p className="text-gray-700 text-sm">No races found.</p>
          ) : (
            <div className="space-y-1.5 max-h-150 overflow-y-auto pr-1">
              {races.map((race) => {
                const isSelected = selectedRace?.round === race.round;
                return (
                  <button
                    key={race.round}
                    onClick={() => setSelectedRace(race)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "border-f1red/50 bg-f1red/10 text-white"
                        : "border-white/5 bg-[#0d0d0d] text-gray-400 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{race.raceName}</p>
                      <span className={`text-xs font-mono ${isSelected ? "text-f1red" : "text-gray-700"}`}>
                        R{race.round}
                      </span>
                    </div>
                    <p className="text-xs opacity-50 mt-0.5">
                      {race.Circuit.Location.country} · {new Date(race.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2">
          {!selectedRace ? (
            <div className="h-full min-h-64 flex items-center justify-center border border-white/5 rounded-2xl">
              <p className="text-gray-700">← Select a race to see results</p>
            </div>
          ) : (
            <>
              {/* Race header */}
              <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">
                      Round {selectedRace.round} · {selectedYear}
                    </p>
                    <h2 className="text-white text-xl font-black">
                      {selectedRace.raceName}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {selectedRace.Circuit.circuitName} · {selectedRace.Circuit.Location.locality}, {selectedRace.Circuit.Location.country}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {new Date(selectedRace.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Results table */}
              {loadingResults ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-[#0d0d0d] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16 border border-white/5 rounded-2xl">
                  <p className="text-gray-600">No results available yet.</p>
                </div>
              ) : (
                <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-12 px-5 py-3 text-gray-600 text-xs uppercase tracking-wider border-b border-white/5">
                    <span className="col-span-1">Pos</span>
                    <span className="col-span-4">Driver</span>
                    <span className="col-span-3">Team</span>
                    <span className="col-span-2">Time</span>
                    <span className="col-span-1 text-center">Grid</span>
                    <span className="col-span-1 text-right">Pts</span>
                  </div>

                  {/* Rows */}
                  {results.map((result, index) => {
                    const pos = parseInt(result.position);
                    const didFinish = result.status === "Finished" || result.status.includes("Lap");
                    const posColor =
                      pos === 1 ? "#F59E0B" :
                      pos === 2 ? "#9CA3AF" :
                      pos === 3 ? "#C89B3C" :
                      "#4B5563";

                    return (
                      <div
                        key={index}
                        className={`grid grid-cols-12 px-5 py-3.5 text-sm border-b border-white/5 last:border-0 transition-colors hover:bg-white/2 ${
                          pos === 1 ? "bg-yellow-500/3" : ""
                        }`}
                      >
                        {/* Position */}
                        <span
                          className="col-span-1 font-black text-base"
                          style={{ color: posColor }}
                        >
                          {result.position}
                        </span>

                        {/* Driver */}
                        <span className="col-span-4 text-white font-semibold flex items-center gap-1.5">
                          {result.Driver.givenName[0]}. {result.Driver.familyName}
                          {result.FastestLap?.rank === "1" && (
                            <span className="text-purple-400 text-xs">⚡</span>
                          )}
                        </span>

                        {/* Team */}
                        <span className="col-span-3 text-gray-500 text-xs self-center">
                          {result.Constructor.name}
                        </span>

                        {/* Time */}
                        <span className="col-span-2 text-gray-500 text-xs self-center">
                          {didFinish ? result.Time?.time ?? "—" : result.status}
                        </span>

                        {/* Grid */}
                        <span className="col-span-1 text-gray-600 text-xs text-center self-center">
                          {result.grid === "0" ? "PL" : result.grid}
                        </span>

                        {/* Points */}
                        <span className={`col-span-1 text-right font-bold self-center ${
                          Number(result.points) > 0 ? "text-f1gold" : "text-gray-700"
                        }`}>
                          {result.points}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}