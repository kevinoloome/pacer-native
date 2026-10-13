// Only used for the viewer's default pace range right now, since there's no
// real auth/profile system yet in either codebase. Runs themselves come from
// Supabase (see runs.js). Mirrors pacer-app/src/lib/mockData.js.

export const defaultPaceRange = { min: 5 * 60 + 15, max: 6 * 60 }; // 5:15-6:00 /km
