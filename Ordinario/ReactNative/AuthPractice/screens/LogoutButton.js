import React, { useContext } from "react";
import { Button, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  return (
    <View style={{ marginVertical: 8 }}>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
