// Esta pantalla la uso para registrar una comida nueva.
// Validaciones completas (todas las entradas) + mensajes inline.
// Recupero "extras" enviados desde otra pantalla (prefill).
// Guardo una clave LOCAL 'dateKey' (YYYY-MM-DD) para evitar saltos por UTC.
// Guardo 'createdAt' para poder ordenar sin parsear fechas.

import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
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

  // estado de errores (para validaciones y mensajes inline)
  const [errors, setErrors] = useState({});

  // recupero "extras" (template) si vienen por navegación y prelleno el form
  const route = useRoute();
  useEffect(() => {
    const t = route.params?.template;
    if (t) {
      if (t.name != null) setName(String(t.name));
      if (t.calories != null) setCalories(String(t.calories));
      if (t.protein != null) setProtein(String(t.protein));
      if (t.carbs != null) setCarbs(String(t.carbs));
      if (t.fat != null) setFat(String(t.fat));
    }
  }, [route.params]);

  // reglas de validación: marco errores y retorno si el form es válido
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio.';
    const kcal = Number(calories);
    if (Number.isNaN(kcal) || kcal <= 0) e.calories = 'Ingresa un número mayor a 0.';
    const numOrEmpty = (v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) >= 0);
    if (!numOrEmpty(protein)) e.protein = 'Valor inválido (usa números ≥ 0).';
    if (!numOrEmpty(carbs))   e.carbs   = 'Valor inválido (usa números ≥ 0).';
    if (!numOrEmpty(fat))     e.fat     = 'Valor inválido (usa números ≥ 0).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // envío del formulario
  const onSubmit = async () => {
    if (!validate()) return; // si hay errores, corto acá

    const kcal = Number(calories);
    const now = new Date();
    const meal = {
      id: `${Date.now()}`,            // id simple para este caso
      name: name.trim(),
      calories: Math.round(kcal),
      protein: protein ? Number(protein) : undefined,
      carbs:   carbs   ? Number(carbs)   : undefined,
      fat:     fat     ? Number(fat)     : undefined,

      // clave de día 100% local (evita que se guarde “al día siguiente”)
      dateKey: ymdLocal(now),

      // campos de compatibilidad / orden
      dateISO: now.toISOString(),     // no lo uso para agrupar, solo compat
      createdAt: Date.now(),          // me sirve para ordenar sin parsear fechas
    };

    await saveMeal(meal);
    Alert.alert('Guardado', 'Comida agregada.');

    // limpio y regreso a Hoy
    setName(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
    navigation.navigate('Hoy');
  };

  // helper para pintar un error bajo cada campo
  const ErrorMsg = ({ msg }) =>
    msg ? <Text style={{ color: 'tomato', marginTop: 4, marginBottom: 6 }}>{msg}</Text> : null;

  const isPrimaryDisabled = !name.trim() || !calories; // deshabilito si falta lo esencial

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput label="Nombre*" value={name} onChangeText={(v)=>{ setName(v); if (errors.name) setErrors(p=>({...p,name:undefined})); }} placeholder="Ej. Pechuga asada" />
        <ErrorMsg msg={errors.name} />

        <FormInput label="Calorías (kcal)*" value={calories} onChangeText={(v)=>{ setCalories(v); if (errors.calories) setErrors(p=>({...p,calories:undefined})); }} placeholder="Ej. 350" keyboardType="numeric" />
        <ErrorMsg msg={errors.calories} />

        <FormInput label="Proteína (g)" value={protein} onChangeText={(v)=>{ setProtein(v); if (errors.protein) setErrors(p=>({...p,protein:undefined})); }} placeholder="Opcional" keyboardType="numeric" />
        <ErrorMsg msg={errors.protein} />

        <FormInput label="Carbohidratos (g)" value={carbs} onChangeText={(v)=>{ setCarbs(v); if (errors.carbs) setErrors(p=>({...p,carbs:undefined})); }} placeholder="Opcional" keyboardType="numeric" />
        <ErrorMsg msg={errors.carbs} />

        <FormInput label="Grasa (g)" value={fat} onChangeText={(v)=>{ setFat(v); if (errors.fat) setErrors(p=>({...p,fat:undefined})); }} placeholder="Opcional" keyboardType="numeric" />
        <ErrorMsg msg={errors.fat} />

        <PrimaryButton title="Agregar comida" onPress={onSubmit} disabled={isPrimaryDisabled} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 6 },
});
