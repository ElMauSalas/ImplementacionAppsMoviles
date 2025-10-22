// screens/LoginScreen.js
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const handleLogin = () => {
    const token = input.trim();
    if (!token) {
      Alert.alert("Token requerido", "Ingresa un token para continuar.");
      return;
    }
    login(token);
  };

  const isDisabled = !input.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Escribe tu token"
        value={input}
        onChangeText={setInput}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Entrar" onPress={handleLogin} disabled={isDisabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
});
