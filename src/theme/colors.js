// Pacer brand tokens, ported 1:1 from the web app's globals.css so the native
// app and the web app stay visually identical. If a color changes, change it
// here and in pacer-app/src/app/globals.css.

export const colors = {
  bg: "#12181D",
  bgElevated: "#1B232B",
  bgElevated2: "#222C35",
  text: "#F3F1E9",
  muted: "#8B96A3",
  accent: "#D6FF3F",
  accentWarm: "#FF6B4A",
  accentBlue: "#6FB7FF",
  line: "#2A333C",
};

// Badge styles for pace-match labels on run cards, mirroring BADGE_STYLES in
// the web app's RunCard.jsx (background/text/border -> React Native equivalents).
export const badgeStyles = {
  great: { bg: "rgba(214,255,63,0.15)", text: colors.accent, border: "rgba(214,255,63,0.3)" },
  fast: { bg: "rgba(255,107,74,0.15)", text: colors.accentWarm, border: "rgba(255,107,74,0.3)" },
  easy: { bg: "rgba(111,183,255,0.15)", text: colors.accentBlue, border: "rgba(111,183,255,0.3)" },
};

// Surface gradients, matching SURFACE_GRADIENT in RunCard.jsx.
export const surfaceGradient = {
  trail: ["#2C5B3E", "#4C8A5C"],
  road: ["#263447", "#4A6FA5"],
  track: ["#4A2E22", "#C2463A"],
};

export const surfaceIcon = {
  trail: "🌲",
  road: "🏙️",
  track: "🏟️",
};
