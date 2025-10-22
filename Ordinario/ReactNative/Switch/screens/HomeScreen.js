import * as React from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../App";

export default function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Home</Text>
      <Button title="Ir a Settings" onPress={() => navigation.navigate("Settings")} />
      <View style={{ height: 12 }} />
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}
