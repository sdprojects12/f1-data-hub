"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/drivers", label: "Drivers" },
    { href: "/teams", label: "Teams" },
    { href: "/races", label: "Races" },
    { href: "/compare", label: "Compare" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#E8002D] rounded flex items-center justify-center">
            <span className="text-white font-black text-sm">F1</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Data <span className="text-[#C89B3C]">Hub</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}