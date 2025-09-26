// Historial simplificado por días (sin carrusel/semana).
// Agrupo por dateKey (YYYY-MM-DD local), ordeno desc y muestro totales por día.
// Esto evita por completo los problemas de zona horaria y hace la UI más clara.

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMeals, deleteMeal } from '../storage/mealStorage';
import MealItem from '../components/MealItem';

// helper: formato legible de 'YYYY-MM-DD' a texto local (es-MX)
function formatDateKey(dateKey) {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateKey;
  }
}

export default function HistoryScreen() {
  // guardo toda la data en memoria
  const [allMeals, setAllMeals] = useState([]);

  // cargo desde storage y ordeno por createdAt (desc)
  const load = useCallback(async () => {
    const all = await getMeals();
    all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    setAllMeals(all);
  }, []);

  // recargo al enfocar la pantalla
  useFocusEffect(useCallback(() => { load(); }, [load]));

  // agrupo por dateKey -> { title, data, totals }
  const sections = useMemo(() => {
    const bucket = new Map(); // dateKey -> array de meals
    for (const m of allMeals) {
      const k = m.dateKey;
      if (!k) continue;
      if (!bucket.has(k)) bucket.set(k, []);
      bucket.get(k).push(m);
    }
    // ordeno dateKeys desc (ISO-like permite ordenar por string)
    const keys = Array.from(bucket.keys()).sort((a, b) => (a < b ? 1 : -1));
    return keys.map((k) => {
      const data = bucket.get(k);
      // totales por día
      const totals = data.reduce(
        (acc, m) => {
          acc.calories += m.calories || 0;
          acc.protein  += m.protein  || 0;
          acc.carbs    += m.carbs    || 0;
          acc.fat      += m.fat      || 0;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      return {
        title: formatDateKey(k),
        dateKey: k,
        totals,
        data, // Sección necesita un array en "data"
      };
    });
  }, [allMeals]);

  const confirmDelete = (id) => {
    Alert.alert('Eliminar', '¿Deseas eliminar esta comida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => { await deleteMeal(id); await load(); },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>Agrupado por día</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionTotals}>
              {section.totals.calories} kcal • P {section.totals.protein}g • C {section.totals.carbs}g • G {section.totals.fat}g
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <MealItem
            meal={item}
            onLongPress={() => confirmDelete(item.id)}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no has registrado comidas.</Text>
        }
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#666', marginTop: 2 },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  sectionTotals: { marginTop: 4, color: '#666' },
  empty: { textAlign: 'center', marginTop: 24, color: '#999' },
});
