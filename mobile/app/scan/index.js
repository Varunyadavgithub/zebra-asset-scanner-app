import { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS } from "@/constants/colors";
import Button from "@/components/ui/Button";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/asset/scan`;

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [assetTag, setAssetTag] = useState("");
  const [greenTag, setGreenTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for auto-focus
  const barcodeRef = useRef(null);
  const assetTagRef = useRef(null);
  const greenTagRef = useRef(null);

  // Auto-focus workflow
  useEffect(() => {
    if (barcode && !assetTag) {
      assetTagRef.current?.focus();
    }
  }, [barcode]);

  useEffect(() => {
    if (barcode && assetTag && !greenTag) {
      greenTagRef.current?.focus();
    }
  }, [barcode, assetTag]);

  const handleBarcodeChange = (text) => setBarcode(text.replace(/[\r\n]/g, ""));
  const handleAssetTagChange = (text) =>
    setAssetTag(text.replace(/[\r\n]/g, ""));
  const handleGreenTagChange = (text) =>
    setGreenTag(text.replace(/[\r\n]/g, ""));

  const saveScan = async () => {
    if (!barcode || !assetTag || !greenTag) {
      Alert.alert("Error", "Please fill all fields before saving!");
      return;
    }
    const payload = { barcode, assetTag, greenTag };

    try {
      setLoading(true);
      await axios.post(API_URL, payload);
      Alert.alert("Success", "Scan data saved to server");
      resetForm();
    } catch (error) {
      console.log("API failed, saving offline:", error.message);

      // Offline fallback
      const offlineData = { ...payload, timestamp: new Date().toISOString() };
      const existing = await AsyncStorage.getItem("offline_scans");
      const scans = existing ? JSON.parse(existing) : [];
      scans.push(offlineData);
      await AsyncStorage.setItem("offline_scans", JSON.stringify(scans));

      Alert.alert("Saved Offline", "Will sync when online");
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBarcode("");
    setAssetTag("");
    setGreenTag("");
    barcodeRef.current?.focus();
  };

  // Disable button if any field is empty or loading
  const isButtonDisabled = !barcode || !assetTag || !greenTag || loading;

  return (
    <>
      <Stack.Screen options={{ title: "Scan Asset" }} />
      <View style={styles.container}>
        {/* Barcode input */}
        <Text style={styles.label}>Barcode</Text>
        <TextInput
          ref={barcodeRef}
          style={styles.input}
          placeholder="Scan or enter barcode"
          placeholderTextColor={COLORS.textLight}
          value={barcode}
          onChangeText={handleBarcodeChange}
          autoFocus
          showSoftInputOnFocus={false}
        />

        {/* Asset Tag input */}
        {barcode.length > 0 && (
          <>
            <Text style={styles.label}>Asset Tag</Text>
            <TextInput
              ref={assetTagRef}
              style={styles.input}
              placeholder="Scan or enter asset tag"
              placeholderTextColor={COLORS.textLight}
              value={assetTag}
              onChangeText={handleAssetTagChange}
              showSoftInputOnFocus={false}
            />
          </>
        )}

        {/* Green Tag input */}
        {barcode.length > 0 && assetTag.length > 0 && (
          <>
            <Text style={styles.label}>Green Tag</Text>
            <TextInput
              ref={greenTagRef}
              style={styles.input}
              placeholder="Scan or enter green tag"
              placeholderTextColor={COLORS.textLight}
              value={greenTag}
              onChangeText={handleGreenTagChange}
              showSoftInputOnFocus={false}
            />
          </>
        )}

        {/* Save button */}
        <Button
          title={loading ? "Saving..." : "Save Scan"}
          onPress={saveScan}
          disabled={isButtonDisabled}
          style={{ marginTop: 20 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
});
