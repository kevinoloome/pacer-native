import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { matchBadge } from "../lib/pace";
import { colors, badgeStyles, surfaceGradient, surfaceIcon } from "../theme/colors";
import { fonts } from "../theme/fonts";

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Native port of pacer-app/src/components/RunCard.jsx. Takes the same `run`
// and `paceRange` shape; `animatedStyle` carries the drag/exit transform
// from DiscoverDeck instead of web drag handlers.
export default function RunCard({ run, paceRange, animatedStyle, zIndex, dimmed, panHandlers }) {
  const badge = matchBadge(run.paceMinSec, paceRange);
  const badgeStyle = badgeStyles[badge.cls];
  const avatars = run.joined.slice(0, 3);
  const extra = run.joined.length > 3 ? run.joined.length - 3 : 0;

  return (
    <Animated.View
      style={[styles.card, { zIndex, opacity: dimmed ? 0.4 : 1 }, animatedStyle]}
      {...(panHandlers ?? {})}
    >
      {/* Photo hero */}
      <LinearGradient
        colors={surfaceGradient[run.surface]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroIcon}>{surfaceIcon[run.surface]}</Text>

        <View style={[styles.badge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{badge.text}</Text>
        </View>

        <LinearGradient
          colors={["rgba(10,14,17,0.95)", "rgba(10,14,17,0.35)", "transparent"]}
          style={styles.heroScrim}
        >
          <Text style={styles.heroTitle}>{run.location}</Text>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMetaText}>{run.when}</Text>
            <Text style={styles.heroMetaText}>
              {run.weather.icon} {run.weather.temp}°C
              {run.weather.rain >= 30 ? `, ${run.weather.rain}% rain` : ""}
            </Text>
          </View>
        </LinearGradient>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.safetyRow}>
          <View style={styles.safetyDot} />
          <Text style={styles.safetyText}>Public meeting point, start/finish alert always sent</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>distance</Text>
            <Text style={styles.statValue}>{run.distance}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>pace</Text>
            <Text style={styles.statValue}>{run.pace}</Text>
          </View>
        </View>

        <View style={styles.joinedRow}>
          <View style={styles.avatarStack}>
            {avatars.map((n, i) => (
              <View key={i} style={[styles.avatar, { marginLeft: i === 0 ? 0 : -8, zIndex: avatars.length - i }]}>
                <Text style={styles.avatarText}>{n}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.joinedText}>
            {run.joined.length}/{run.capacity} runners going
            {extra > 0 ? `, +${extra} more` : ""}
          </Text>
        </View>

        <Text style={styles.note}>{run.note}</Text>

        <View style={styles.hostRow}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostAvatarText}>{initials(run.host)}</Text>
          </View>
          <View>
            <View style={styles.hostNameRow}>
              <Text style={styles.hostName}>{run.host}</Text>
              {run.hostVerified && <Text style={styles.verified}> ✓</Text>}
            </View>
            <Text style={styles.hostMeta}>{run.hostMeta}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgElevated,
    overflow: "hidden",
  },
  hero: {
    height: 132,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroIcon: {
    fontSize: 46,
    opacity: 0.45,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 14,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
  },
  heroScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "flex-end",
    padding: 16,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: "#FFFFFF",
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  heroMetaText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: "#D8DCE1",
  },
  body: {
    padding: 16,
  },
  safetyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  safetyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  safetyText: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.muted,
    flexShrink: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.muted,
  },
  statValue: {
    fontFamily: fonts.monoBold,
    fontSize: 15,
    color: colors.text,
  },
  joinedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  avatarStack: {
    flexDirection: "row",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.bg,
  },
  joinedText: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.muted,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: "#C7CCD3",
    lineHeight: 18,
    marginBottom: 14,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
  },
  hostAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  hostAvatarText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.bg,
  },
  hostNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostName: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.text,
  },
  verified: {
    color: colors.accent,
    fontSize: 12,
  },
  hostMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
  },
});
