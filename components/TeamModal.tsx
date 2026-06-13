"use client";

import { useEffect } from "react";
import { TeamInfo } from "@/data/teams";
import { Driver } from "@/types/f1";
import Image from "next/image";

interface Props {
  team: TeamInfo | null;
  drivers: Driver[];
  onClose: () => void;
}

export default function TeamModal({ team, drivers, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!team) return null;

  const teamDrivers = drivers.filter((d) => d.team_name === team.name);

  const stats = [
    { label: "First Entry", value: team.firstEntry },
    { label: "Championships", value: team.championships },
    { label: "Years in F1", value: 2026 - team.firstEntry + 1 },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Team color bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: team.color }} />

        {/* Header with gradient */}
        <div
          className="px-6 pt-6 pb-8 relative"
          style={{
            background: `radial-gradient(ellipse at top right, ${team.color}18, transparent 70%)`,
          }}
        >
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
            >
              ✕
            </button>
          </div>

          {/* Team identity */}
          <div className="flex items-center gap-5">
            {/* Logo or fallback */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
              style={{
                backgroundColor: `${team.color}18`,
                border: `1px solid ${team.color}30`,
              }}
            >
              {team.logoPath ? (
                <Image
                  src={team.logoPath}
                  alt={`${team.name} logo`}
                  width={64}
                  height={64}
                  className="object-contain p-1.5"
                />
              ) : (
                <span
                  className="text-lg font-black tracking-wider"
                  style={{ color: team.color }}
                >
                  {team.shortName}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-white text-2xl font-black">{team.name}</h2>
              <p className="text-gray-500 text-sm mt-0.5">{team.base}</p>
              <p className="text-gray-600 text-xs mt-1">
                Principal:{" "}
                <span className="text-gray-400">{team.principal}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-5">

          {/* Car image or placeholder */}
          <div
            className="w-full h-28 rounded-xl flex items-center justify-center border border-dashed overflow-hidden"
            style={{
              borderColor: `${team.color}30`,
              backgroundColor: `${team.color}08`,
            }}
          >
            {team.carImagePath ? (
              <Image
                src={team.carImagePath}
                alt={`${team.name} car`}
                width={400}
                height={112}
                className="object-contain w-full h-full p-2"
              />
            ) : (
              <p className="text-gray-700 text-xs">Car image coming soon</p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                <p
                  className="font-black text-lg"
                  style={{
                    color:
                      stat.label === "Championships" && stat.value > 0
                        ? team.color
                        : "white",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* 2026 Drivers */}
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">
              2026 Drivers
            </p>
            {teamDrivers.length === 0 ? (
              <p className="text-gray-700 text-sm">No driver data available</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {teamDrivers.map((driver) => (
                  <div
                    key={driver.driver_number}
                    className="bg-white/5 rounded-xl p-3 flex items-center gap-3"
                    style={{ borderLeft: `2px solid ${team.color}` }}
                  >
                    {driver.headshot_url && (
                      <Image
                        src={driver.headshot_url}
                        alt={driver.full_name}
                        width={44}
                        height={44}
                        className="object-contain shrink-0"
                        unoptimized
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {driver.full_name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        #{driver.driver_number}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}