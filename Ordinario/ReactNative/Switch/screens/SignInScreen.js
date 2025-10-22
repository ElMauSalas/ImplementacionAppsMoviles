import * as React from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../App";

export default function SignInScreen() {
  const { signIn } = React.useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Iniciar sesión</Text>
      <Button title="Entrar" onPress={signIn} />
    </View>
  );
}
