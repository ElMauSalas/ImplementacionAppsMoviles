// src/storage/mealStorage.js
// Aquí encapsulo la persistencia con AsyncStorage.
// También hago "compat": si alguna comida vieja no tiene dateKey/createdAt, la completo al vuelo.

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@meals_v1';

// helper para construir 'YYYY-MM-DD' en local desde un Date o string/number
function ymdLocalFrom(dateMaybe) {
  const d = dateMaybe instanceof Date ? dateMaybe : new Date(dateMaybe || Date.now());
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const da = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${da}`;
}

// leo, parseo y completo campos faltantes
export async function getMeals() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) || [];
    return list.map((m) => {
      // ✅ si falta dateKey, la genero de forma LOCAL (priorizo dateISO si existe)
      if (!m.dateKey) m.dateKey = ymdLocalFrom(m.dateISO ? new Date(m.dateISO) : new Date());
      // ✅ si falta createdAt, lo derivo de dateISO o uso ahora
      if (!m.createdAt) m.createdAt = m.dateISO ? +new Date(m.dateISO) : Date.now();
      return m;
    });
  } catch {
    return [];
  }
}

// agrego la comida al final y guardo
export async function saveMeal(meal) {
  const list = await getMeals();
  list.push(meal);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

// elimino por id y guardo
export async function deleteMeal(id) {
  const list = await getMeals();
  const next = list.filter((m) => m.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

// reemplazo en bloque (útil para import/reset)
export async function setMeals(meals) {
  await AsyncStorage.setItem(KEY, JSON.stringify(meals));
}
