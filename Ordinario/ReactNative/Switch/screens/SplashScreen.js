import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Cargando…</Text>
    </View>
  );
}
