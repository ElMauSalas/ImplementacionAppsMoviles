// src/navigation/RootNavigator.js
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

// Screens
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import CalculatorScreen from "../screens/CalculatorScreen";
import NameScreen from "../screens/NameScreen";
import RandomScreen from "../screens/RandomScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: "Calculadora" }} />
      <Stack.Screen name="Name" component={NameScreen} options={{ title: "Tu Nombre" }} />
      <Stack.Screen name="Random" component={RandomScreen} options={{ title: "Número Aleatorio" }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { userToken } = useContext(AuthContext);
  // Si NO hay token, solo muestra AuthStack; si hay, AppStack
  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
