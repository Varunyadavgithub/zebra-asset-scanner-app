import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { COLORS } from "@/constants/colors";
import Button from "@/components/ui/Button";

const { width, height } = Dimensions.get("window");

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [psn, setPsn] = useState("");
  const [assetTag, setAssetTag] = useState("");

  // Save scan data (here using AsyncStorage as example)
  const saveScan = async () => {
    if (!barcode || !psn || !assetTag) {
      Alert.alert("Error", "Please fill all fields before saving!");
      return;
    }

    const scanData = {
      barcode,
      psn,
      assetTag,
      timestamp: new Date().toISOString(),
    };

    try {
      // Using AsyncStorage for now
      const existing = await AsyncStorage.getItem("scans");
      const scans = existing ? JSON.parse(existing) : [];
      scans.push(scanData);
      await AsyncStorage.setItem("scans", JSON.stringify(scans));

      Alert.alert("Success", "Scan saved!");
      // Reset fields
      setBarcode("");
      setPsn("");
      setAssetTag("");
    } catch (error) {
      Alert.alert("Error", "Failed to save scan");
      console.log(error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Scan Asset",
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        {/* Barcode */}
        <Text style={styles.label}>Barcode:</Text>
        <TextInput
          style={styles.input}
          placeholder="Scan or enter barcode"
          value={barcode}
          onChangeText={setBarcode}
        />

        {/* Asset Tag */}
        <Text style={styles.label}>Asset Tag:</Text>
        <TextInput
          style={styles.input}
          placeholder="Scan or enter asset tag"
          value={assetTag}
          onChangeText={setAssetTag}
        />

        {/* Save Button */}
        <Button title="Save Scan" onPress={saveScan} />
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
    borderColor: COLORS.mutedText || "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    fontSize: 16,
  },
});
