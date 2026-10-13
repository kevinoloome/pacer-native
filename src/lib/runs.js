import { supabase } from "./supabaseClient";
import { formatPace } from "./pace";

// Maps a raw Supabase `runs` row (snake_case, matching pacer-app/supabase/schema.sql)
// into the camelCase shape the components expect. Same mapping as
// pacer-app/src/lib/runs.js, kept identical on purpose since both apps read
// from the same Supabase project and table.
function mapRun(row) {
  return {
    id: row.id,
    location: row.location,
    when: row.when_text,
    distance: `${row.distance_km} km`,
    distanceKm: row.distance_km,
    surface: row.surface,
    dayCat: row.day_cat,
    pace: `${formatPace(row.pace_sec)} /km`,
    paceMinSec: row.pace_sec,
    weather: { icon: row.weather_icon, temp: row.weather_temp, rain: row.weather_rain },
    note: row.note,
    host: row.host_name,
    hostVerified: row.host_verified,
    hostMeta: row.host_meta,
    hostPhoto: row.host_photo,
    capacity: row.capacity,
    joined: row.joined ?? [],
  };
}

export async function fetchRuns() {
  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapRun);
}
