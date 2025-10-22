import React from "react";
import { View, Button, StyleSheet } from "react-native";
import LogoutButton from "./LogoutButton";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Calculadora" onPress={() => navigation.navigate("Calculator")} />
      <Button title="Escribe tu nombre" onPress={() => navigation.navigate("Name")} />
      <Button title="Generador aleatorio" onPress={() => navigation.navigate("Random")} />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, justifyContent: "center", padding: 20 },
});
