// Compares a run's pace against the viewer's comfortable pace range and
// returns a badge describing how good the match is. Identical logic to
// pacer-app/src/lib/pace.js, kept in sync by hand since this is a separate
// codebase.

export function matchBadge(runPaceSec, paceRange) {
  const { min, max } = paceRange;
  if (runPaceSec >= min && runPaceSec <= max) {
    return { text: "Great pace match", cls: "great" };
  }
  if (runPaceSec < min) {
    return { text: "Faster than your pace", cls: "fast" };
  }
  return { text: "Easier than your pace", cls: "easy" };
}

export function formatPace(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
