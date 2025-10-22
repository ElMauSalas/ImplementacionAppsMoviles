import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import LogoutButton from "./LogoutButton";

export default function NameScreen() {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribe tu nombre</Text>
      <TextInput
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Imprimir en pantalla" onPress={() => setVisible(name)} />
      {!!visible && <Text style={styles.result}>Hola, {visible} 👋</Text>}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
  result: { marginTop: 8, fontSize: 18, textAlign: "center" },
});
