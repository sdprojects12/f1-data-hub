// This file describes the "shape" of the data we get from the OpenF1 API.
// TypeScript uses these to catch mistakes — if you try to use a field
// that doesn't exist, it will warn you immediately.

export interface Driver {
  driver_number: number;
  full_name: string;
  first_name: string;
  last_name: string;
  broadcast_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code?: string;
  headshot_url: string;
  session_key: number;
}

export interface Race {
  session_key: number;
  session_name: string;
  date_start: string;
  country_name: string;
  circuit_short_name: string;
  year: number;
}

export interface LapData {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  is_pit_out_lap: boolean;
}