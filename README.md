# F1 Data Hub 🏎️

A Formula 1 data website built with Next.js, TypeScript, and Tailwind CSS. Explore drivers, teams, race results, and championship standings from every F1 season since 1950.

## Live Site
Coming soon on Vercel.

## Features

- **Drivers** — Browse the 2026 F1 grid, view career stats, wins, podiums, and championships
- **Teams** — All 11 constructors with team info, principals, and driver lineups
- **Race Archive** — Full race results from every Grand Prix since 1950
- **Standings** — Driver and Constructor championship standings for every season
- **Compare** — Head-to-head career stat comparison between any two drivers

## Tech Stack

- [Next.js 16](https://nextjs.org/) — Framework
- [TypeScript](https://www.typescriptlang.org/) — Language
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [OpenF1 API](https://openf1.org/) — Live 2026 driver and session data
- [Jolpica/Ergast API](https://api.jolpi.ca/) — Historical race results and standings

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sdprojects12/f1-data-hub
cd f1-data-hub
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```text
f1-data-hub/
├── app/                        # Next.js App Router (Pages & API Routes)
│   ├── api/                    # Server-side API endpoints
│   │   ├── career/             # Driver career statistics API route
│   │   └── openf1/             # OpenF1 proxy to bypass CORS restrictions
│   ├── compare/                # Driver head-to-head comparison page
│   ├── drivers/                # Current grid drivers listing page
│   ├── favorites/              # Saved/favorited drivers and teams page
│   ├── races/                  # Historical race results page
│   ├── standings/              # Driver & Constructor standings page
│   ├── teams/                  # F1 constructor lineups and details page
│   ├── globals.css             # Tailwind CSS global styles
│   ├── layout.tsx              # Root layout defining navbar and site envelope
│   └── page.tsx                # Home / Landing page
├── components/                 # Reusable client & server React components
│   ├── DriverCard.tsx          # Card interface displaying grid driver info
│   ├── DriverModal.tsx         # In-depth modal with driver stats & charts
│   ├── Navbar.tsx              # Application-wide responsive navigation menu
│   ├── StandingsControls.tsx   # Controls to query season/type of standings
│   ├── TeamCard.tsx            # Card interface for F1 constructors
│   └── TeamModal.tsx           # In-depth modal with constructor info
├── data/                       # Local static database datasets
│   └── teams.ts                # Constructor histories, grid lineups, and primary hex colors
├── lib/                        # Utility modules and API client wrappers
│   ├── favorites.ts            # LocalStorage helper functions for driver/team saving
│   └── openf1.ts               # API integrations for OpenF1 (live) & Jolpica Ergast (historical)
├── public/                     # Public static assets
│   ├── cars/                   # High-quality images of team cars
│   ├── drivers/                # High-quality driver portrait headshots
│   └── logos/                  # High-quality vector team branding logos
├── scripts/                    # Diagnostic and utility scripts
│   └── check_openf1.js         # direct command-line validator for OpenF1 API status
├── types/                      # TypeScript definitions
│   └── f1.ts                   # Strongly typed interfaces for F1 data contracts
└── [Config Files]              # tsconfig.json, next.config.mjs, postcss.config.mjs, etc.
```
## Data Sources

- **OpenF1 API** — Free, no API key required. Provides live session and driver data from 2023 onwards.
- **Jolpica/Ergast API** — Free, no API key required. Provides complete F1 historical data from 1950 to present.

## Notes

- Constructor standings are only available from 1958 onwards (when they were introduced).
- Driver images are sourced from the OpenF1 API and may not always reflect the latest season.
- Best lap times are only available for sessions with OpenF1 data (2023+).

## License
MIT
