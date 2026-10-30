import React from "react";
import { Pressable, Text, View } from "react-native";
import { ThemeSettings } from "../../stores/themeStore";
import { Small } from "../../components/ui";
import { fontFamily } from "../../utils/theme";
export default function Stepper({ theme, label, value, min, max, onChange, suffix }: { theme: ThemeSettings; label: string; value: number; min: number; max: number; onChange: (value: number) => void; suffix: string }) {
  const buttonStyle = { backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius };
  return <View className="mt-4 p-3" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
    <View className="mb-3 flex-row items-center justify-between"><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{label}</Text><Small theme={theme}>{min === 0 && max === 24 ? "Cantos" : "Traço"}</Small></View>
    <View className="flex-row items-center justify-center gap-3"><Pressable accessibilityRole="button" accessibilityLabel={`Diminuir ${label.toLowerCase()}`} disabled={value <= min} onPress={() => onChange(Math.max(min, value - 1))} className="h-9 w-9 items-center justify-center" style={[buttonStyle, value <= min ? { opacity: 0.45 } : null]}><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-base font-bold">−</Text></Pressable><View className="min-w-16 items-center justify-center"><Text accessibilityLabel={`${value}${suffix}`} style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-base font-black">{value}{suffix}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Aumentar ${label.toLowerCase()}`} disabled={value >= max} onPress={() => onChange(Math.min(max, value + 1))} className="h-9 w-9 items-center justify-center" style={[buttonStyle, value >= max ? { opacity: 0.45 } : null]}><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-base font-bold">＋</Text></Pressable></View>
  </View>;
}
