// Esta pantalla es la que muestra las comidas registradas el día de HOY.
// Aquí puedo ver el total de calorías y macros (proteínas, carbohidratos y grasas)
// y también tengo la lista de comidas del día con opción de eliminar.

import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMeals, deleteMeal } from '../storage/mealStorage';
import MealItem from '../components/MealItem';
// isSameDay lo estaba usando para comparar fechas, pero más adelante lo podemos
// reemplazar por la clave local 'dateKey' para evitar errores de zona horaria.
import { isSameDay } from 'date-fns';
import { palette, radius, shadow } from '../theme/colors';

export default function TodayScreen() {
  // aquí guardo el estado de las comidas de hoy
  const [meals, setMeals] = useState([]);
  // este estado lo uso para mostrar el loader de "pull-to-refresh"
  const [refreshing, setRefreshing] = useState(false);

  // función para cargar comidas de hoy desde AsyncStorage
  const load = useCallback(async () => {
    const all = await getMeals();
    const today = new Date();
    // filtro solo las comidas del día de hoy y las ordeno por hora descendente
    const todays = all
      .filter((m) => isSameDay(new Date(m.dateISO), today))
      .sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO));
    setMeals(todays);
  }, []);

  // cada vez que entro a la pantalla, recargo la información
  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  // calculo los totales del día sumando los valores de cada comida
  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += m.calories || 0;
      acc.protein  += m.protein  || 0;
      acc.carbs    += m.carbs    || 0;
      acc.fat      += m.fat      || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // confirmación para eliminar una comida
  const confirmDelete = (id) => {
    Alert.alert('Eliminar', '¿Quieres eliminar esta comida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteMeal(id);
          await load();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* tarjeta con el resumen de calorías y macros */}
      <View style={styles.headerCard}>
        <Text style={styles.kcal}>{totals.calories} kcal</Text>
        <View style={styles.chipsRow}>
          {/* cada chip muestra el total de un macronutriente */}
          <View style={[styles.chip, { backgroundColor: '#ecfeff' }]}>
            <Text style={[styles.chipTxt, { color: palette.blue }]}>P {totals.protein}g</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: '#fff7ed' }]}>
            <Text style={[styles.chipTxt, { color: palette.amber }]}>C {totals.carbs}g</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.chipTxt, { color: palette.green }]}>G {totals.fat}g</Text>
          </View>
        </View>
      </View>

      {/* lista de comidas del día */}
      <FlatList
        data={meals}
        keyExtractor={(m) => m.id}
        // con esto puedo hacer "pull-to-refresh"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
          />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay comidas registradas hoy.</Text>}
        renderItem={({ item }) => (
          <MealItem
            meal={item}
            // puedo borrar con longPress o con el botón de eliminar
            onLongPress={() => confirmDelete(item.id)}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
      />
    </View>
  );
}

// estilos de la tarjeta de resumen y de la lista
const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: palette.card,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    ...shadow.card,
  },
  kcal: { fontSize: 32, fontWeight: '800', color: palette.text },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.lg },
  chipTxt: { fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 24, color: palette.textDim },
});
