import { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, Pressable, Animated, PanResponder, Dimensions, StyleSheet } from "react-native";
import RunCard from "./RunCard";
import { matchBadge } from "../lib/pace";
import { fetchRuns } from "../lib/runs";
import { defaultPaceRange } from "../lib/mockData";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 110;

// Native port of pacer-app/src/components/DiscoverDeck.jsx. Same data flow
// (fetch from Supabase, pace filter, swipe-to-advance) but drag/exit motion
// is driven by RN's Animated + PanResponder instead of pointer events + CSS
// transforms.
export default function DiscoverDeck() {
  const [allRuns, setAllRuns] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'ready' | 'error'
  const [deckIndex, setDeckIndex] = useState(0);
  const [paceFilterOn, setPaceFilterOn] = useState(true);

  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ["-18deg", "0deg", "18deg"],
  });

  useEffect(() => {
    let cancelled = false;
    fetchRuns()
      .then((runs) => {
        if (cancelled) return;
        setAllRuns(runs);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load runs:", err);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const paceRange = defaultPaceRange;

  const pool = paceFilterOn
    ? allRuns.filter((r) => matchBadge(r.paceMinSec, paceRange).cls === "great")
    : allRuns;

  const visible = pool.slice(deckIndex, deckIndex + 3);

  const advance = useCallback(() => {
    pan.setValue({ x: 0, y: 0 });
    setDeckIndex((i) => i + 1);
  }, [pan]);

  const swipe = useCallback(
    (direction) => {
      const toX = direction === "right" ? SCREEN_WIDTH * 1.3 : -SCREEN_WIDTH * 1.3;
      Animated.timing(pan, {
        toValue: { x: toX, y: 40 },
        duration: 240,
        useNativeDriver: false,
      }).start(() => advance());
    },
    [pan, advance]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          swipe("right");
        } else if (g.dx < -SWIPE_THRESHOLD) {
          swipe("left");
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <View style={styles.centerBox}>
          <Text style={styles.mutedText}>Loading runs...</Text>
        </View>
      )}

      {status === "error" && (
        <View style={[styles.centerBox, styles.dashedBox]}>
          <Text style={styles.emptyTitle}>Couldn&apos;t load runs</Text>
          <Text style={styles.mutedTextCenter}>
            Check that your .env has EXPO_PUBLIC_SUPABASE_URL and
            EXPO_PUBLIC_SUPABASE_ANON_KEY set, and that the runs table exists.
          </Text>
        </View>
      )}

      {status === "ready" && (
        <>
          {/* Filters row */}
          <View style={styles.filterRow}>
            <View style={styles.filterText}>
              <Text style={styles.filterTitle}>Pace-matched only</Text>
              <Text style={styles.filterSubtitle}>Only show great pace matches</Text>
            </View>
            <Pressable
              onPress={() => setPaceFilterOn((v) => !v)}
              style={[
                styles.toggle,
                paceFilterOn ? styles.toggleOn : styles.toggleOff,
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  { left: paceFilterOn ? 18 : 2, backgroundColor: paceFilterOn ? colors.accent : colors.muted },
                ]}
              />
            </Pressable>
          </View>

          {/* Deck */}
          <View style={styles.deck}>
            {visible.length === 0 ? (
              <View style={[styles.centerBox, styles.dashedBox]}>
                <Text style={styles.emptyTitle}>You&apos;re caught up</Text>
                <Text style={styles.mutedTextCenter}>
                  {paceFilterOn
                    ? "No more pace-matched runs right now. Try turning the filter off, or post your own."
                    : "No more runs nearby right now."}
                </Text>
              </View>
            ) : (
              visible
                .map((run, i) => {
                  const depth = visible.length - 1 - i;
                  const isFront = depth === 0;
                  if (isFront) {
                    return (
                      <RunCard
                        key={run.id}
                        run={run}
                        paceRange={paceRange}
                        zIndex={10}
                        panHandlers={panResponder.panHandlers}
                        animatedStyle={{
                          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
                        }}
                      />
                    );
                  }
                  return (
                    <RunCard
                      key={run.id}
                      run={run}
                      paceRange={paceRange}
                      zIndex={10 - depth}
                      dimmed={depth > 1}
                      animatedStyle={{
                        transform: [{ translateY: depth * 10 }, { scale: 1 - depth * 0.035 }],
                      }}
                    />
                  );
                })
                .reverse()
            )}
          </View>

          {/* Swipe actions */}
          {visible.length > 0 && (
            <View style={styles.actionsRow}>
              <Pressable style={styles.passBtn} onPress={() => swipe("left")}>
                <Text style={styles.passIcon}>{"✕"}</Text>
              </Pressable>
              <Pressable style={styles.joinBtn} onPress={() => swipe("right")}>
                <Text style={styles.joinIcon}>{"♡"}</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  centerBox: {
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  dashedBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.line,
    borderRadius: 18,
    padding: 32,
  },
  mutedText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  mutedTextCenter: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.text,
    marginBottom: 4,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  filterText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterTitle: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.text,
  },
  filterSubtitle: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.muted,
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  toggleOn: {
    backgroundColor: "rgba(214,255,63,0.2)",
    borderColor: colors.accent,
  },
  toggleOff: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderColor: colors.line,
  },
  toggleKnob: {
    position: "absolute",
    top: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  deck: {
    height: 500,
    position: "relative",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  passBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  passIcon: {
    fontSize: 22,
    color: colors.accentWarm,
  },
  joinBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  joinIcon: {
    fontSize: 26,
    color: colors.accent,
  },
});
