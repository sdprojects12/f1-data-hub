"use client";

import { useState, useEffect } from "react";
import { getDriversClient, getRacesClient, TEAM_ORDER } from "@/lib/openf1";
import { Driver } from "@/types/f1";
import DriverCard from "@/components/DriverCard";
import DriverModal from "@/components/DriverModal";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [lastSessionKey, setLastSessionKey] = useState<number | undefined>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([getDriversClient(2026), getRacesClient(2026)]).then(
      ([allDrivers, races]) => {
        const sorted = [...allDrivers].sort((a, b) => {
          const orderA = TEAM_ORDER[a.team_name] ?? 99;
          const orderB = TEAM_ORDER[b.team_name] ?? 99;
          return orderA - orderB;
        });
        setDrivers(sorted);
        if (races.length > 0) {
          setLastSessionKey(races[races.length - 1].session_key);
        }
      }
    );
  }, []);

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.full_name?.toLowerCase().includes(q) ||
      d.team_name?.toLowerCase().includes(q) ||
      d.name_acronym?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          2026{" "}
          <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Drivers
          </span>
        </h1>
        <p className="text-gray-500">
          All drivers from the 2026 Formula 1 season. Click any card to see career stats.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, team, or acronym..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 focus:border-white/30 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 outline-none transition-colors text-sm"
        />
        {search && (
          <p className="text-gray-600 text-xs mt-2">
            {filtered.length} driver{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Grid */}
      
      {/* Grid */}
      {drivers.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-56 bg-[#0d0d0d] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600 text-sm">No drivers match &quot;{search}&quot;</p>
      ) : (
      <div className="space-y-8">
        {Object.entries(
          filtered.reduce((groups, driver) => {
            const team = driver.team_name ?? "Unknown";
            if (!groups[team]) groups[team] = [];
            groups[team].push(driver);
            return groups;
          }, {} as Record<string, typeof filtered>)
        ).map(([teamName, teamDrivers]) => (
          <div key={teamName}>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">
              {teamName}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {teamDrivers.map((driver) => (
                <div key={driver.driver_number} onClick={() => setSelected(driver)}>
                  <DriverCard driver={driver} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}

      <DriverModal
        driver={selected}
        onClose={() => setSelected(null)}
        lastSessionKey={lastSessionKey}
      />

    </main>
  );
}