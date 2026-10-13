import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

// Native port of pacer-app/src/components/TopBar.jsx.
export default function TopBar() {
  return (
    <View style={styles.row}>
      <Text style={styles.wordmark}>
        pacer<Text style={{ color: colors.accent }}>.</Text>
      </Text>
      <View style={styles.right}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>📍 Nairobi</Text>
        </View>
        <Pressable style={styles.bell}>
          <Text style={styles.bellText}>🔔</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pill: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  bell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  bellText: {
    fontSize: 15,
  },
});
