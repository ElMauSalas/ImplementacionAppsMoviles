// Este es mi botón primario reutilizable, yo le paso el título, la acción onPress y un flag disabled. Uso Pressable para poder reaccionar al estado "pressed" con una pequeña animación.
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { palette, radius, shadow } from '../theme/colors';

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        pressed && { opacity: 0.9, transform: [{ scale: 0.995 }] },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadow.card,
  },
  txt: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
