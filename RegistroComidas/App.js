
// 1) Un Stack (para poder empujar pantallas si en el futuro quiero flujos)
// 2) Un Tab (abajo) con tres pestañas: Hoy, Agregar e Historial.
// Además personalizo colores y los íconos con Ionicons.

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodayScreen from './src/screens/TodayScreen';
import AddMealScreen from './src/screens/AddMealScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';
import { palette } from './src/theme/colors';


// Aquí creo mis navegadores: uno de pestañas (Tab) y uno de pila (Stack)
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Este componente define las tres pestañas principales de la app
// Uso screenOptions en función de la ruta para configurar la barra inferior y los íconos
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textDim,
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) => {
          const map = { Hoy: 'restaurant', Agregar: 'add-circle', Historial: 'calendar' };
          return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Hoy" component={TodayScreen} />
      <Tab.Screen name="Agregar" component={AddMealScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // envuelvo todo en NavigationContainer y sobreescribo el tema por defecto
    // cambio el color de fondo global usando mi paleta para que combine con el diseño
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: palette.bg } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
