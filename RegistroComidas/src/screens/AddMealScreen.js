// Esta pantalla la uso para registrar una comida nueva.
// Para evitar que “salte” de día por UTC, guardo una clave LOCAL 'dateKey' (YYYY-MM-DD)
// construida con getFullYear/getMonth/getDate. También guardo 'createdAt' para ordenar.

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet } from 'react-native';
import { saveMeal } from '../storage/mealStorage';
import PrimaryButton from '../components/PrimaryButton';
import FormInput from '../components/FormInput';

// helper local: genero 'YYYY-MM-DD' usando getters en horario local
function ymdLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function AddMealScreen({ navigation }) {
  // estados del formulario controlado
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // envío del formulario
  const onSubmit = async () => {
    if (!name.trim()) return Alert.alert('Falta nombre', 'Ingresa el nombre de la comida.');

    const kcal = Number(calories);
    if (Number.isNaN(kcal) || kcal <= 0) {
      return Alert.alert('Kcal inválidas', 'Ingresa un número mayor a 0.');
    }

    const now = new Date();
    const meal = {
      id: `${Date.now()}`,            // id simple para este caso
      name: name.trim(),
      calories: Math.round(kcal),
      protein: protein ? Number(protein) : undefined,
      carbs: carbs ? Number(carbs) : undefined,
      fat: fat ? Number(fat) : undefined,

      // ✅ clave de día 100% local (evita que se guarde “al día siguiente”)
      dateKey: ymdLocal(now),

      // campos de compatibilidad / orden
      dateISO: now.toISOString(),     // no lo uso para agrupar, solo compat
      createdAt: Date.now(),          // ✅ me sirve para ordenar sin parsear fechas
    };

    await saveMeal(meal);
    Alert.alert('Guardado', 'Comida agregada.');

    // limpio y regreso a Hoy
    setName(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
    navigation.navigate('Hoy');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput label="Nombre*" value={name} onChangeText={setName} placeholder="Ej. Pechuga asada" />
        <FormInput label="Calorías (kcal)*" value={calories} onChangeText={setCalories} placeholder="Ej. 350" keyboardType="numeric" />
        <FormInput label="Proteína (g)" value={protein} onChangeText={setProtein} placeholder="Opcional" keyboardType="numeric" />
        <FormInput label="Carbohidratos (g)" value={carbs} onChangeText={setCarbs} placeholder="Opcional" keyboardType="numeric" />
        <FormInput label="Grasa (g)" value={fat} onChangeText={setFat} placeholder="Opcional" keyboardType="numeric" />
        <PrimaryButton title="Agregar comida" onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 6 },
});
