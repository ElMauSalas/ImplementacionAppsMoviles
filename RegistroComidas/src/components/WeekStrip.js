// Este componente me muestra una "tira" de la semana actual (o la que yo pase).
// Yo le envío:
//  - days: array de fechas (Date) para cada día visible.
//  - selectedDate: la fecha actualmente seleccionada.
//  - onSelectDay: callback cuando toco un día.
//  - onPrevWeek / onNextWeek: navegación semanal con las flechas.
//  - kcalByDay: objeto { 'yyyy-MM-dd': kcal } para mostrar calorías por día.
//  - title: un título que muestro en el encabezado (ej. "Esta semana").
// Con esto, puedo navegar semanas y ver rápidamente cuántas kcal llevo por día.

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { palette, radius, shadow } from '../theme/colors';


//  - Normalizo fechas con date-fns usando el formato 'yyyy-MM-dd' para comparar y para mapear kcal.
//  - Uso la ISO del Date como key del Pressable para tener una key estable.
//  - Mantengo el scroll horizontal sin indicador para una apariencia más limpia.
export default function WeekStrip({ days, selectedDate, onSelectDay, onPrevWeek, onNextWeek, kcalByDay = {}, title }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onPrevWeek} style={styles.navBtn}><Text style={styles.navTxt}>{'‹'}</Text></Pressable>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onNextWeek} style={styles.navBtn}><Text style={styles.navTxt}>{'›'}</Text></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd');
          const isSelected = key === format(selectedDate, 'yyyy-MM-dd');
          const k = kcalByDay[key] || 0;
          return (
            <Pressable key={d.toISOString()} onPress={() => onSelectDay(d)} style={[styles.day, isSelected && styles.daySelected]}>
              <Text style={[styles.weekday, isSelected && styles.selTxt]}>{format(d, 'EEE')}</Text>
              <Text style={[styles.dayNum, isSelected && styles.selTxt]}>{format(d, 'd')}</Text>
              <View style={[styles.kcalPill, isSelected && styles.kcalPillSel]}>
                <Text style={[styles.kcalTxt, isSelected && styles.kcalTxtSel]}>{k} kcal</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8, backgroundColor: palette.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  title: { fontWeight: '800', color: palette.text },
  navBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radius.md, backgroundColor: 'white', borderWidth: 1, borderColor: palette.border, ...shadow.card },
  navTxt: { fontSize: 18, color: palette.text },
  row: { paddingHorizontal: 12, gap: 10 },
  day: { width: 92, paddingVertical: 10, borderRadius: radius.lg, backgroundColor: 'white', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: palette.border, ...shadow.card },
  daySelected: { backgroundColor: palette.primarySoft, borderColor: palette.primary },
  weekday: { textTransform: 'uppercase', fontSize: 12, color: palette.textDim },
  dayNum: { fontSize: 20, fontWeight: '800', color: palette.text },
  kcalPill: { marginTop: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#f1f5f9' },
  kcalPillSel: { backgroundColor: 'white' },
  kcalTxt: { fontSize: 12, color: palette.textDim, fontWeight: '700' },
  kcalTxtSel: { color: palette.primary },
});
