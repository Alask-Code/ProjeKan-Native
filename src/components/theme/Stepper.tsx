import React, { useMemo, useRef, useState } from "react";
import { PanResponder, Text, View } from "react-native";
import { ThemeSettings } from "../../stores/themeStore";
import { Small } from "../../components/ui";
import { fontFamily } from "../../utils/theme";

export default function Stepper({ theme, label, value, min, max, onChange, suffix }: { theme: ThemeSettings; label: string; value: number; min: number; max: number; onChange: (value: number) => void; suffix: string }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const startX = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const range = Math.max(1, max - min);
  const percent = Math.max(0, Math.min(1, (value - min) / range));
  const updateFromX = (x: number) => {
    if (trackWidth <= 0) return;
    const position = Math.max(0, Math.min(trackWidth, x));
    onChangeRef.current(min + Math.round((position / trackWidth) * range));
  };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (event) => {
      startX.current = event.nativeEvent.locationX;
      updateFromX(startX.current);
    },
    onPanResponderMove: (_event, gesture) => updateFromX(startX.current + gesture.dx),
    onPanResponderRelease: (_event, gesture) => updateFromX(startX.current + gesture.dx),
  }), [trackWidth, min, max]);

  return <View className="mt-4 p-3" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
    <View className="mb-2 flex-row items-center justify-between"><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-xs font-bold">{label}</Text><Text accessibilityLabel={`${value}${suffix}`} style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-xs font-black">{value}{suffix}</Text></View>
    <View accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ min, max, now: value }} onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)} {...responder.panHandlers} className="h-9 justify-center">
      <View pointerEvents="none" className="h-2 overflow-hidden" style={{ backgroundColor: theme.raised, borderRadius: 99 }}><View style={{ width: `${percent * 100}%`, height: "100%", backgroundColor: theme.primary }} /></View>
      <View pointerEvents="none" style={{ position: "absolute", left: Math.max(0, Math.min(trackWidth - 20, percent * trackWidth - 10)), width: 20, height: 20, borderRadius: 10, backgroundColor: theme.primary, borderColor: theme.background, borderWidth: 2, elevation: 2 }} />
    </View>
    <View className="flex-row justify-between"><Small theme={theme}>{min}{suffix}</Small><Small theme={theme}>{max}{suffix}</Small></View>
  </View>;
}
