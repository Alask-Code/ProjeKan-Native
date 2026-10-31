import React, { useState } from "react";
import { Modal, Platform, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { ThemeSettings } from "../stores/themeStore";
import { Action, AppIcon } from "./ui";
import { fontFamily, inputDynamic, isDark } from "../utils/theme";

function parseDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) return date;
  }
  return new Date();
}

function serializeDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateValue(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? parseDate(value).toLocaleDateString("pt-BR") : value;
}

export function DatePickerField({ value, onChange, theme, placeholder = "Selecionar data", accessibilityLabel, style }: { value: string; onChange: (value: string) => void; theme: ThemeSettings; placeholder?: string; accessibilityLabel?: string; style?: StyleProp<ViewStyle> }) {
  const [visible, setVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(() => parseDate(value));
  const label = value ? formatDateValue(value) : placeholder;
  const openPicker = () => {
    const initialDate = parseDate(value);
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: "date",
        display: "calendar",
        design: "material",
        title: "Selecionar data",
        onValueChange: (_event, selectedDate) => { if (selectedDate) onChange(serializeDate(selectedDate)); },
      });
      return;
    }
    setDraftDate(initialDate);
    setVisible(true);
  };
  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? (value ? `Data selecionada: ${label}` : placeholder)} onPress={openPicker} className="min-h-11 flex-row items-center justify-between gap-2 px-3" style={[inputDynamic(theme), style]}>
      <Text numberOfLines={1} style={{ color: value ? theme.text : theme.muted, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs">{label}</Text>
      <AppIcon name="calendar" size={17} color={theme.primary} />
    </Pressable>
    {Platform.OS === "ios" ? <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
      <View className="flex-1 justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar seletor de data" onPress={() => setVisible(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <View className="overflow-hidden p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
          <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mb-2 text-sm font-bold">Selecionar data</Text>
          <DateTimePicker value={draftDate} mode="date" display="spinner" locale="pt-BR" themeVariant={isDark(theme.background) ? "dark" : "light"} accentColor={theme.primary} onValueChange={(_event, selectedDate) => setDraftDate(selectedDate)} />
          <View className="mt-3 flex-row justify-end gap-2"><Action theme={theme} secondary onPress={() => setVisible(false)}>Cancelar</Action><Action theme={theme} onPress={() => { onChange(serializeDate(draftDate)); setVisible(false); }}>Confirmar</Action></View>
        </View>
      </View>
    </Modal> : null}
  </>;
}

