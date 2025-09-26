// src/screens/TodayScreen.js
// Animaciones visibles:
// 1) Header (totales) entra con fade + slide-in.
// 2) Cada elemento de la lista aparece con fade + slide-in.
// Además conservo: Intents (implícitos/explicito), Extras (plantilla), Validaciones (en AddMeal), y LayoutAnimation.

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View, Text, FlatList, RefreshControl, StyleSheet, Alert,
  LayoutAnimation, UIManager, Platform, Pressable, Linking, Share, Animated, Easing
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';

import { getMeals, deleteMeal } from '../storage/mealStorage';
import MealItem from '../components/MealItem';
import { palette, radius, shadow } from '../theme/colors';

// habilito animaciones de layout en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// helper local: 'YYYY-MM-DD' hoy
function ymdLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Componente para animar la aparición de cada item
function AnimatedMealItem({ item, onDelete, onLongPress, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    // escalono un poco la entrada para que se vea “en cascada”
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      delay: 40 * Math.min(index, 10), // máx 10 ítems con retraso
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      delay: 40 * Math.min(index, 10),
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [opacity, translateY, index]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <MealItem meal={item} onLongPress={onLongPress} onDelete={onDelete} />
    </Animated.View>
  );
}

export default function TodayScreen() {
  const navigation = useNavigation();

  // comidas de hoy + estado de refresh
  const [meals, setMeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Animación del header (totales)
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-10)).current;

  const playHeaderIn = useCallback(() => {
    headerOpacity.setValue(0);
    headerTranslate.setValue(-10);
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [headerOpacity, headerTranslate]);

  // cargo comidas de HOY usando dateKey local y ordeno por createdAt desc
  const load = useCallback(async () => {
    const all = await getMeals();
    const todayKey = ymdLocal(new Date());

    const todays = all
      .filter((m) => m.dateKey === todayKey)
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // cambios de layout
    setMeals(todays);
    playHeaderIn(); // header vuelve a entrar animado
  }, [playHeaderIn]);

  // recargo al entrar a la pantalla
  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  // totales del día
  const totals = useMemo(
    () =>
      meals.reduce(
        (acc, m) => {
          acc.calories += m.calories || 0;
          acc.protein += m.protein || 0;
          acc.carbs += m.carbs || 0;
          acc.fat += m.fat || 0;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [meals]
  );

  // eliminar con confirmación + animación
  const confirmDelete = (id) => {
    Alert.alert('Eliminar', '¿Quieres eliminar esta comida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteMeal(id);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          await load();
        },
      },
    ]);
  };

  // --------- INTENTS (implícitos y explícito) + EXTRAS (template) ---------
  const abrirMapas = async () => {
    const q = encodeURIComponent('gimnasio cerca de mi');
    const url = Platform.select({
      android: `geo:0,0?q=${q}`,
      ios: `http://maps.apple.com/?q=${q}`,
    });
    await Linking.openURL(url);
  };

  const compartirResumen = async () => {
    await Share.share({
      message: `Hoy llevo ${totals.calories} kcal · P ${totals.protein}g · C ${totals.carbs}g · G ${totals.fat}g`,
    });
  };

  const abrirAjustesApp = async () => {
    const pkg = Application.applicationId || 'host.exp.exponent';
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
      { data: `package:${pkg}` }
    );
  };

  const usarPlantilla = () => {
    navigation.navigate('Agregar', {
      template: { name: 'Pechuga asada', calories: '300', protein: '45' },
    });
  };

  const Btn = ({ title, onPress }) => (
    <Pressable onPress={onPress} style={styles.utilBtn}>
      <Text style={styles.utilBtnTxt}>{title}</Text>
    </Pressable>
  );
  // -----------------------------------------------------------------------

  return (
    <View style={{ flex: 1 }}>
      {/* header animado */}
      <Animated.View
        style={[
          styles.headerCard,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Text style={styles.kcal}>{totals.calories} kcal</Text>
        <View style={styles.chipsRow}>
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
      </Animated.View>

      {/* fila de utilidades: Intents + Extras */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 12 }}>
        <Btn title="Abrir Mapas" onPress={abrirMapas} />
        <Btn title="Compartir" onPress={compartirResumen} />
        <Btn title="Ajustes App" onPress={abrirAjustesApp} />
        <Btn title="Usar plantilla" onPress={usarPlantilla} />
      </View>

      {/* lista con items animados */}
      <FlatList
        data={meals}
        keyExtractor={(m) => m.id}
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
        renderItem={({ item, index }) => (
          <AnimatedMealItem
            item={item}
            index={index}
            onLongPress={() => confirmDelete(item.id)}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
      />
    </View>
  );
}

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

  // botones utilitarios (intents / extras)
  utilBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    backgroundColor: '#fff',
    marginRight: 8,
    ...shadow.card,
  },
  utilBtnTxt: { color: palette.text, fontWeight: '700' },
});
