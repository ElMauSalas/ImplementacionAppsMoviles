// Este ítem representa una comida en la lista. Yo muestro el nombre, calorías y, si vienen, macros (proteína, carbohidratos y grasa).
// Además, dejo dos interacciones:
// - onLongPress: para acciones como seleccionar/editar (lo manejo desde el padre).
// - onDelete: botón visible solo si me pasan la prop (lo uso en pantallas donde se puede borrar).

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, radius, shadow } from '../theme/colors';

export default function MealItem({ meal, onLongPress, onDelete }) {
  return (
    // uso Pressable para soportar onLongPress (lo conecto desde la pantalla que lo use)
    <Pressable onLongPress={onLongPress} style={styles.card}>
      <View style={styles.leftAccent} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.meta}>
          {meal.calories} kcal
          {meal.protein ? ` • P ${meal.protein}g` : ''}
          {meal.carbs ? ` • C ${meal.carbs}g` : ''}
          {meal.fat ? ` • G ${meal.fat}g` : ''}
        </Text>
      </View>

      {onDelete ? (
        <Pressable onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={palette.danger} />
          <Text style={styles.deleteTxt}>Eliminar</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.card,
  },
  leftAccent: {
    width: 6,
    alignSelf: 'stretch',
    borderRadius: radius.sm,
    backgroundColor: palette.primary,
  },
  title: { fontSize: 16, fontWeight: '700', color: palette.text },
  meta: { color: palette.textDim, marginTop: 4 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: palette.dangerSoft,
  },
  deleteTxt: { color: palette.danger, fontWeight: '700' },
});
