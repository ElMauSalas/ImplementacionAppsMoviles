import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import LogoutButton from "./LogoutButton";

export default function RandomScreen() {
  const [value, setValue] = useState(null);

  const generar = () => {
    const n = Math.floor(Math.random() * 100) + 1; // 1..100
    setValue(n);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generador de número aleatorio</Text>
      <Button title="Generar" onPress={generar} />
      {value !== null && <Text style={styles.result}>Número: {value}</Text>}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  result: { marginTop: 8, fontSize: 18, textAlign: "center" },
});
