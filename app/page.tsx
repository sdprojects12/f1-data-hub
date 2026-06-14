import Link from "next/link";

const stats = [
  { value: "75+", label: "Seasons" },
  { value: "1000+", label: "Grands Prix" },
  { value: "20", label: "Teams ever" },
  { value: "800+", label: "Drivers" },
];

const features = [
  {
    href: "/drivers",
    emoji: "👤",
    title: "Drivers",
    description:
      "Explore every driver on the 2026 grid. Career stats, wins, podiums, and championships at a glance.",
    accent: "#E8002D",
  },
  {
    href: "/teams",
    emoji: "🏭",
    title: "Teams",
    description:
      "All 11 constructors in 2026. Team history, principals, and driver lineups.",
    accent: "#C89B3C",
  },
  {
    href: "/races",
    emoji: "🗓️",
    title: "Race Archive",
    description:
      "75 years of Formula 1 history. Browse every race result from 1950 to today.",
    accent: "#E8002D",
  },
  {
    href: "/compare",
    emoji: "⚖️",
    title: "Compare",
    description:
      "Put two drivers head-to-head. Wins, podiums, championships — who comes out on top?",
    accent: "#C89B3C",
  },
];

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6">

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-f1red rounded-full animate-pulse" />
            <span className="text-gray-400 text-sm font-medium">
              2026 Season Live
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
            The home of{" "}
            <span
              suppressHydrationWarning
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #E8002D, #C89B3C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Formula 1
            </span>{" "}
            data.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Explore drivers, teams, and race results from every season since
            1950. Built for fans who love the numbers behind the sport.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/drivers"
              className="bg-f1red hover:bg-[#c8001f] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Explore Drivers
            </Link>
            <Link
              href="/races"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Race Archive
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 py-10 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                suppressHydrationWarning
                className="text-4xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #E8002D, #C89B3C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What is F1 */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1 h-8 bg-f1gold rounded-full" />
          <h2 className="text-white text-3xl font-bold">What is Formula 1?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {[
            {
              icon: "🏎️",
              title: "The Cars",
              body: "F1 cars are the fastest racing cars in the world, reaching over 350 km/h and pulling 5G of lateral force through corners.",
            },
            {
              icon: "🏆",
              title: "The Championship",
              body: "20+ races across the globe each season. Drivers and teams earn points to compete for the World Championship title.",
            },
            {
              icon: "🌍",
              title: "The Teams",
              body: "11 constructors each field 2 drivers and design their own cars, competing for the Constructors Championship.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#0d0d0d] p-8">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1 h-8 bg-f1red rounded-full" />
          <h2 className="text-white text-3xl font-bold">Explore F1 Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group bg-[#0d0d0d] border border-white/5 hover:border-white/15 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl">{feature.emoji}</span>
                <span className="text-gray-700 group-hover:text-gray-400 transition-colors text-2xl">
                  →
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-f1gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          F1 Data Hub — built with Next.js & OpenF1
        </p>
        <p className="text-gray-700 text-xs">
          Not affiliated with Formula 1 or FIA
        </p>
      </footer>

    </main>
  );
}