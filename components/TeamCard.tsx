import Image from "next/image";
import { TeamInfo } from "@/data/teams";

export default function TeamCard({ team }: { team: TeamInfo }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">

      <div className="h-0.5 w-full" style={{ backgroundColor: team.color }} />

      <div className="p-6">
        {/* Logo or fallback abbreviation */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 overflow-hidden"
          style={{
            backgroundColor: `${team.color}18`,
            border: `1px solid ${team.color}30`,
          }}
        >
          {team.logoPath ? (
            <Image
              src={team.logoPath}
              alt={`${team.name} logo`}
              width={48}
              height={48}
              className="object-contain p-1"
            />
          ) : (
            <span
              className="text-sm font-black tracking-wider"
              style={{ color: team.color }}
            >
              {team.shortName}
            </span>
          )}
        </div>

        <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-f1gold transition-colors">
          {team.name}
        </h3>
        <p className="text-gray-600 text-xs mb-5">{team.base}</p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="text-gray-600 text-xs mb-0.5">Est.</p>
            <p className="text-white font-semibold text-sm">{team.firstEntry}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-xs mb-0.5">Championships</p>
            <p
              className="font-black text-lg"
              style={{ color: team.championships > 0 ? team.color : "#374151" }}
            >
              {team.championships}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}