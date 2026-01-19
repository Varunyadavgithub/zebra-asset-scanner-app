import { Text, View, Image, StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/colors";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 50% Image */}
      <View style={styles.imageSection}>
        <Image
          source={require("@/assets/images/hero-image.png")}
          style={styles.heroImage}
        />
      </View>

      {/* 50% Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Asset Tracking System</Text>

        <Text style={styles.subtitle}>
          Scan barcodes, PSN numbers, and asset tags to track your assets
          efficiently
        </Text>

        <View style={styles.primaryAction}>
          <Button
            title="Start Asset Scan"
            onPress={() => router.push("/scan")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* ---------- IMAGE (50%) ---------- */
  imageSection: {
    height: height * 0.5, // 🔥 EXACT 50%
  },

  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  /* ---------- CONTENT (50%) ---------- */
  contentSection: {
    height: height * 0.5, // 🔥 EXACT 50%
    paddingHorizontal: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.mutedText || "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: "90%",
  },

  primaryAction: {
    width: "100%",
  },
});
