// Este componente lo hice para reutilizar campos de formulario de forma consistente.
// Yo paso la etiqueta (label), el valor y el onChangeText desde la pantalla que lo usa.
// También dejo configurable el placeholder y el tipo de teclado (keyboardType).

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { palette, radius } from '../theme/colors';

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9aa3af"
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        blurOnSubmit={false}   
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '700', color: palette.text, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: palette.border, borderRadius: radius.lg,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: 'white', color: palette.text,
  },
});
