"use client";

import { useState, useEffect } from "react";
import { getDriversClient } from "@/lib/openf1";
import { Driver } from "@/types/f1";
import Image from "next/image";
import { DRIVER_IMAGES } from "@/lib/openf1";

interface CareerStats {
  wins: number;
  podiums: number;
  championships: number;
  races: number;
}

async function fetchStats(acronym: string): Promise<CareerStats | null> {
  try {
    const res = await fetch(`/api/career/${acronym}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const STAT_LABELS: { key: keyof CareerStats; label: string; emoji: string }[] = [
  { key: "races", label: "Races", emoji: "🏁" },
  { key: "wins", label: "Wins", emoji: "🥇" },
  { key: "podiums", label: "Podiums", emoji: "🏆" },
  { key: "championships", label: "Championships", emoji: "👑" },
];

export default function ComparePage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverA, setDriverA] = useState<Driver | null>(null);
  const [driverB, setDriverB] = useState<Driver | null>(null);
  const [statsA, setStatsA] = useState<CareerStats | null>(null);
  const [statsB, setStatsB] = useState<CareerStats | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  useEffect(() => {
    getDriversClient(2026).then((all) => {
      const sorted = [...all].sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );
      setDrivers(sorted);
    });
  }, []);

  useEffect(() => {
  if (!driverA) return;
  const load = async () => {
    setLoadingA(true);
    setStatsA(null);
    const s = await fetchStats(driverA.name_acronym);
    setStatsA(s);
    setLoadingA(false);
  };
  load();
}, [driverA]);

useEffect(() => {
  if (!driverB) return;
  const load = async () => {
    setLoadingB(true);
    setStatsB(null);
    const s = await fetchStats(driverB.name_acronym);
    setStatsB(s);
    setLoadingB(false);
  };
  load();
}, [driverB]);

  const teamColorA = driverA?.team_colour ? `#${driverA.team_colour}` : "#E8002D";
  const teamColorB = driverB?.team_colour ? `#${driverB.team_colour}` : "#C89B3C";

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          Driver <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Compare</span>
        </h1>
        <p className="text-gray-500">
          Select two drivers to compare their career statistics head-to-head.
        </p>
      </div>

      {/* Driver selectors */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {/* Driver A */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Driver A</label>
          <select
            className="w-full bg-[#0d0d0d] border border-white/10 focus:border-f1red text-white rounded-lg px-4 py-2.5 outline-none transition-colors"
            value={driverA?.driver_number ?? ""}
            onChange={(e) => {
              const d = drivers.find(
                (d) => d.driver_number === Number(e.target.value)
              );
              setDriverA(d ?? null);
            }}
          >
            <option value="">Select a driver...</option>
            {drivers.map((d) => (
              <option key={d.driver_number} value={d.driver_number}>
                {d.full_name} — {d.team_name}
              </option>
            ))}
          </select>
        </div>

        {/* Driver B */}
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Driver B</label>
          <select
            className="w-full bg-[#0d0d0d] border border-white/10 focus:border-f1gold text-white rounded-lg px-4 py-2.5 outline-none transition-colors"
            value={driverB?.driver_number ?? ""}
            onChange={(e) => {
              const d = drivers.find(
                (d) => d.driver_number === Number(e.target.value)
              );
              setDriverB(d ?? null);
            }}
          >
            <option value="">Select a driver...</option>
            {drivers.map((d) => (
              <option key={d.driver_number} value={d.driver_number}>
                {d.full_name} — {d.team_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison area */}
      {!driverA && !driverB ? (
        <div className="text-center py-24 border border-white/5 rounded-2xl">
          <p className="text-gray-600 text-lg">Select two drivers above to begin</p>
        </div>
      ) : (
        <>
          {/* Driver cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { driver: driverA, stats: statsA, loading: loadingA, color: teamColorA },
              { driver: driverB, stats: statsB, loading: loadingB, color: teamColorB },
            ].map((side, i) => (
              <div
                key={i}
                className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden"
              >
                <div className="h-1 w-full" style={{ backgroundColor: side.color }} />
                <div className="p-6 text-center">
                  {side.driver ? (
                    <>
                      {side.driver.headshot_url && (
                        <Image
                          src={DRIVER_IMAGES[side.driver.driver_number] ?? side.driver.headshot_url}
                          alt={side.driver.full_name}
                          width={120}
                          height={120}
                          className="object-contain mx-auto mb-3"
                          unoptimized
                        />
                      )}
                      <p className="text-gray-500 font-mono text-sm">
                        #{side.driver.driver_number}
                      </p>
                      <h3 className="text-white font-bold text-xl mt-1">
                        {side.driver.full_name}
                      </h3>
                      <p className="text-sm font-medium mt-1" style={{ color: side.color }}>
                        {side.driver.team_name}
                      </p>
                    </>
                  ) : (
                    <div className="py-8 text-gray-600">No driver selected</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats comparison */}
          {(driverA || driverB) && (
            <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                  Career Statistics
                </p>
              </div>

              <div className="divide-y divide-white/5">
                {STAT_LABELS.map(({ key, label, emoji }) => {
                  const valA = statsA?.[key] ?? 0;
                  const valB = statsB?.[key] ?? 0;
                  const total = valA + valB;
                  const pctA = total === 0 ? 50 : (valA / total) * 100;
                  const pctB = total === 0 ? 50 : (valB / total) * 100;
                  const aWins = valA > valB;
                  const bWins = valB > valA;

                  return (
                    <div key={key} className="px-6 py-5">
                      {/* Label */}
                      <p className="text-center text-gray-500 text-xs uppercase tracking-wider mb-4">
                        {emoji} {label}
                      </p>

                      {/* Values + bar */}
                      <div className="flex items-center gap-4">
                        {/* Value A */}
                        <div className="w-16 text-right">
                          {loadingA ? (
                            <div className="h-7 w-12 bg-gray-800 rounded animate-pulse ml-auto" />
                          ) : (
                            <span
                              className={`text-2xl font-black ${aWins ? "text-white" : "text-gray-600"}`}
                            >
                              {statsA ? valA : "—"}
                            </span>
                          )}
                        </div>

                        {/* Bar */}
                        <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-gray-800">
                          {statsA && statsB && (
                            <>
                              <div
                                className="h-full rounded-l-full transition-all duration-700"
                                style={{
                                  width: `${pctA}%`,
                                  backgroundColor: teamColorA,
                                }}
                              />
                              <div
                                className="h-full rounded-r-full transition-all duration-700"
                                style={{
                                  width: `${pctB}%`,
                                  backgroundColor: teamColorB,
                                }}
                              />
                            </>
                          )}
                        </div>

                        {/* Value B */}
                        <div className="w-16 text-left">
                          {loadingB ? (
                            <div className="h-7 w-12 bg-gray-800 rounded animate-pulse" />
                          ) : (
                            <span
                              className={`text-2xl font-black ${bWins ? "text-white" : "text-gray-600"}`}
                            >
                              {statsB ? valB : "—"}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}