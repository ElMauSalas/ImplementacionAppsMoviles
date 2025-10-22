import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import LogoutButton from "./LogoutButton";

export default function CalculatorScreen() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [res, setRes] = useState(null);

  const sumar = () => {
    const n1 = parseFloat(a) || 0;
    const n2 = parseFloat(b) || 0;
    setRes(n1 + n2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Número A"
        value={a}
        onChangeText={setA}
        style={styles.input}
      />
      <TextInput
        keyboardType="numeric"
        placeholder="Número B"
        value={b}
        onChangeText={setB}
        style={styles.input}
      />
      <Button title="Sumar" onPress={sumar} />
      {res !== null && <Text style={styles.result}>Resultado: {res}</Text>}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
  result: { fontSize: 18, textAlign: "center", marginTop: 8 },
});
