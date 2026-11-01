import React, { useState } from "react";
import { Modal, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { ThemeSettings } from "../stores/themeStore";
import { Action, AppIcon } from "./ui";
import { fontFamily, inputDynamic } from "../utils/theme";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

function firstOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

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
  const [displayedMonth, setDisplayedMonth] = useState(() => firstOfMonth(parseDate(value)));
  const label = value ? formatDateValue(value) : placeholder;
  const openPicker = () => {
    const selectedDate = parseDate(value);
    setDraftDate(selectedDate);
    setDisplayedMonth(firstOfMonth(selectedDate));
    setVisible(true);
  };
  const today = new Date();
  const firstWeekday = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const monthLabel = displayedMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? (value ? `Data selecionada: ${label}` : placeholder)} onPress={openPicker} className="min-h-11 flex-row items-center justify-between gap-2 px-3" style={[inputDynamic(theme), style]}>
      <Text numberOfLines={1} style={{ color: value ? theme.text : theme.muted, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs">{label}</Text>
      <AppIcon name="calendar" size={17} color={theme.primary} />
    </Pressable>
    <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
      <View className="flex-1 justify-center bg-black/60 px-5">
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar seletor de data" onPress={() => setVisible(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <View className="w-full self-center p-4" style={{ maxWidth: 380, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font), letterSpacing: 1 }} className="text-[9px] font-extrabold">DATA DO PROJETO</Text>
              <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mt-1 text-base font-black">Selecionar data</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Ir para hoje" onPress={() => { const date = new Date(); setDraftDate(date); setDisplayedMonth(firstOfMonth(date)); }} className="rounded-lg px-2.5 py-2" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-[9px] font-extrabold">HOJE</Text>
            </Pressable>
          </View>
          <View className="mb-3 flex-row items-center justify-between">
            <Pressable accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => setDisplayedMonth((month) => shiftMonth(month, -1))} className="h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <AppIcon name="chevronLeft" size={18} color={theme.text} />
            </Pressable>
            <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-sm font-extrabold">{monthLabel}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Próximo mês" onPress={() => setDisplayedMonth((month) => shiftMonth(month, 1))} className="h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <AppIcon name="chevronRight" size={18} color={theme.text} />
            </Pressable>
          </View>
          <View className="mb-1 flex-row">
            {weekDays.map((day, index) => <View key={`${day}-${index}`} className="h-9 flex-1 items-center justify-center"><Text accessibilityLabel={["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][index]} style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[9px] font-bold">{day}</Text></View>)}
          </View>
          <View className="gap-y-1">
            {Array.from({ length: 6 }, (_, weekIndex) => <View key={weekIndex} className="flex-row">
              {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                if (day === null) return <View key={`${weekIndex}-${dayIndex}`} className="flex-1 aspect-square p-0.5" />;
                const date = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), day);
                const selected = sameDay(date, draftDate);
                const isToday = sameDay(date, today);
                const dateLabel = date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                return <Pressable key={day} accessibilityRole="button" accessibilityLabel={`${dateLabel}${selected ? ", selecionada" : ""}`} accessibilityState={{ selected }} onPress={() => setDraftDate(date)} className="flex-1 aspect-square items-center justify-center p-0.5">
                  <View className="h-full w-full items-center justify-center rounded-lg" style={{ backgroundColor: selected ? theme.primary : "transparent", borderColor: isToday && !selected ? theme.primary : "transparent", borderWidth: isToday && !selected ? Math.max(theme.borderWidth, 1) : 0, borderRadius: theme.borderRadius }}>
                    <Text style={{ color: selected ? theme.background : theme.text, fontFamily: fontFamily(theme.font) }} className="text-[10px] font-bold">{day}</Text>
                  </View>
                </Pressable>;
              })}
            </View>)}
          </View>
          <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="mt-3 text-center text-[10px]">{draftDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</Text>
          <View className="mt-4 flex-row justify-end gap-2">
            <Action theme={theme} secondary onPress={() => setVisible(false)}>Cancelar</Action>
            <Action theme={theme} onPress={() => { onChange(serializeDate(draftDate)); setVisible(false); }}>Confirmar</Action>
          </View>
        </View>
      </View>
    </Modal>
  </>;
}
