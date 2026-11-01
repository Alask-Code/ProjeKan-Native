import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { ThemeSettings } from "../../stores/themeStore";
import { Action, AppIcon } from "../ui";
import { fontFamily } from "../../utils/theme";

export default function ReminderTimePickerModal({ visible, time, theme, onClose, onChange, onSetMinute, onConfirm }: {
  visible: boolean;
  time: Date;
  theme: ThemeSettings;
  onClose: () => void;
  onChange: (unit: "hour" | "minute", amount: number) => void;
  onSetMinute: (minute: number) => void;
  onConfirm: (time: Date) => void;
}) {
  return <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
    <View className="flex-1 justify-center bg-black/60 px-5">
      <Pressable accessibilityRole="button" accessibilityLabel="Fechar horário" onPress={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      <View className="w-full self-center p-5" style={{ maxWidth: 380, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font), letterSpacing: 1 }} className="text-[9px] font-extrabold">LEMBRETE DIÁRIO</Text>
            <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mt-1 text-base font-black">Escolha um horário</Text>
          </View>
          <View className="h-10 w-10 items-center justify-center" style={{ backgroundColor: theme.raised, borderRadius: theme.borderRadius }}>
            <AppIcon name="clock" size={20} color={theme.primary} />
          </View>
        </View>
        <View className="mb-4 flex-row items-center gap-3">
          {(["hour", "minute"] as const).map((unit) => {
            const value = unit === "hour" ? time.getHours() : time.getMinutes();
            const label = unit === "hour" ? "Hora" : "Minutos";
            return <React.Fragment key={unit}>
              {unit === "minute" ? <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-2xl font-black">:</Text> : null}
              <View className="flex-1 items-center rounded-2xl p-3" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Aumentar ${label.toLowerCase()}`} onPress={() => onChange(unit, 1)} className="h-10 w-12 items-center justify-center" style={{ backgroundColor: theme.surface, borderRadius: theme.borderRadius }}>
                  <AppIcon name="plus" size={16} color={theme.primary} />
                </Pressable>
                <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontFamily: fontFamily(theme.font), fontVariant: ["tabular-nums"] }} className="my-2 text-4xl font-black">{String(value).padStart(2, "0")}</Text>
                <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="mb-2 text-[9px] font-bold">{label}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={`Diminuir ${label.toLowerCase()}`} onPress={() => onChange(unit, -1)} className="h-10 w-12 items-center justify-center" style={{ backgroundColor: theme.surface, borderRadius: theme.borderRadius }}>
                  <AppIcon name="minus" size={16} color={theme.primary} />
                </Pressable>
              </View>
            </React.Fragment>;
          })}
        </View>
        <View className="mb-1 flex-row items-center justify-between">
          <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[10px] font-semibold">Minutos rápidos</Text>
          <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[9px]">Formato 24 horas</Text>
        </View>
        <View className="flex-row gap-2">
          {[0, 15, 30, 45].map((minute) => {
            const selected = time.getMinutes() === minute;
            return <Pressable key={minute} accessibilityRole="button" accessibilityLabel={`Definir minutos para ${String(minute).padStart(2, "0")}`} accessibilityState={{ selected }} onPress={() => onSetMinute(minute)} className="min-h-10 flex-1 items-center justify-center rounded-lg" style={{ backgroundColor: selected ? theme.primary : theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
              <Text style={{ color: selected ? theme.background : theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{String(minute).padStart(2, "0")}</Text>
            </Pressable>;
          })}
        </View>
        <View className="mt-5 flex-row justify-end gap-2">
          <Action theme={theme} secondary onPress={onClose}>Cancelar</Action>
          <Action theme={theme} onPress={() => onConfirm(time)}>Salvar horário</Action>
        </View>
      </View>
    </View>
  </Modal>;
}
