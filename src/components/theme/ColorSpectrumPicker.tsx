import React, { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, PanResponder, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ThemeSettings } from "../../stores/themeStore";
import { Action, AppIcon } from "../ui";
import { fontFamily, inputDynamic } from "../../utils/theme";

type HsvColor = { hue: number; saturation: number; value: number };

function normalizeHex(color: string) {
  const hex = color.trim().replace(/^#/, "");
  return /^[0-9A-F]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : "#000000";
}

function hexToHsv(color: string): HsvColor {
  const hex = normalizeHex(color).slice(1);
  const red = parseInt(hex.slice(0, 2), 16) / 255;
  const green = parseInt(hex.slice(2, 4), 16) / 255;
  const blue = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return { hue, saturation: max === 0 ? 0 : delta / max, value: max };
}

function hsvToHex({ hue, saturation, value }: HsvColor) {
  const chroma = value * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const [red, green, blue] = section < 1 ? [chroma, secondary, 0]
    : section < 2 ? [secondary, chroma, 0]
      : section < 3 ? [0, chroma, secondary]
        : section < 4 ? [0, secondary, chroma]
          : section < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const match = value - chroma;
  return `#${[red, green, blue].map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function hueToHex(hue: number) {
  return hsvToHex({ hue, saturation: 1, value: 1 });
}

const hueStops = [0, 60, 120, 180, 240, 300, 360];

export default function ColorSpectrumPicker({ visible, color, label, theme, onClose, onApply }: {
  visible: boolean;
  color: string;
  label: string;
  theme: ThemeSettings;
  onClose: () => void;
  onApply: (color: string) => void;
}) {
  const { height } = useWindowDimensions();
  const [selection, setSelection] = useState(() => hexToHsv(color));
  const [hexText, setHexText] = useState(() => normalizeHex(color));
  const [squareWidth, setSquareWidth] = useState(0);
  const [hueWidth, setHueWidth] = useState(0);
  const squareStart = useRef({ x: 0, y: 0 });
  const hueStart = useRef(0);
  const selectionRef = useRef(selection);
  const hexTextRef = useRef(hexText);
  selectionRef.current = selection;
  hexTextRef.current = hexText;
  const selectedColor = hsvToHex(selection);

  const updateSelection = (next: HsvColor) => {
    setSelection(next);
    const nextHex = hsvToHex(next).toUpperCase();
    setHexText(nextHex);
    hexTextRef.current = nextHex;
    selectionRef.current = next;
  };
  const updateSquare = (x: number, y: number) => {
    if (!squareWidth) return;
    const saturation = Math.max(0, Math.min(1, x / squareWidth));
    const value = 1 - Math.max(0, Math.min(1, y / squareWidth));
    updateSelection({ ...selectionRef.current, saturation, value });
  };
  const updateHue = (x: number) => {
    if (!hueWidth) return;
    const hue = Math.max(0, Math.min(1, x / hueWidth)) * 360;
    updateSelection({ ...selectionRef.current, hue });
  };
  const squareResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (event) => {
      squareStart.current = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
      updateSquare(squareStart.current.x, squareStart.current.y);
    },
    onPanResponderMove: (_event, gesture) => updateSquare(squareStart.current.x + gesture.dx, squareStart.current.y + gesture.dy),
    onPanResponderRelease: (_event, gesture) => updateSquare(squareStart.current.x + gesture.dx, squareStart.current.y + gesture.dy),
  }), [squareWidth]);
  const hueResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (event) => {
      hueStart.current = event.nativeEvent.locationX;
      updateHue(hueStart.current);
    },
    onPanResponderMove: (_event, gesture) => updateHue(hueStart.current + gesture.dx),
    onPanResponderRelease: (_event, gesture) => updateHue(hueStart.current + gesture.dx),
  }), [hueWidth]);

  const open = () => {
    const initialHex = normalizeHex(color);
    const next = hexToHsv(initialHex);
    setSelection(next);
    selectionRef.current = next;
    setHexText(initialHex);
    hexTextRef.current = initialHex;
  };
  const updateHex = (value: string) => {
    const nextText = value.startsWith("#") ? value.toUpperCase() : `#${value.toUpperCase()}`;
    setHexText(nextText);
    hexTextRef.current = nextText;
    if (/^#[0-9A-F]{6}$/.test(nextText)) updateSelection(hexToHsv(nextText));
  };
  const close = () => {
    onClose();
  };
  const confirm = () => {
    const finalColor = /^#[0-9A-F]{6}$/.test(hexTextRef.current) ? hexTextRef.current : selectedColor;
    onApply(finalColor.toLowerCase());
    onClose();
  };

  return <Modal transparent animationType="fade" visible={visible} onShow={open} onRequestClose={close}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
    <View className="flex-1 justify-center bg-black/60 px-5">
      <Pressable accessibilityRole="button" accessibilityLabel="Fechar seletor de cor" onPress={close} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      <View className="w-full self-center p-4" style={{ maxWidth: 400, maxHeight: height * 0.9, flexShrink: 1, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, elevation: 24 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font), letterSpacing: 1 }} className="text-[9px] font-extrabold">ESPECTRO RGB</Text>
            <Text numberOfLines={1} style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mt-1 text-base font-black">{label}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar seletor de cor" onPress={close} className="h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
            <AppIcon name="close" size={17} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingBottom: 4 }} keyboardShouldPersistTaps="handled">
        <View onLayout={(event) => setSquareWidth(event.nativeEvent.layout.width)} {...squareResponder.panHandlers} accessibilityRole="adjustable" accessibilityLabel="Espectro de saturação e brilho" className="w-full overflow-hidden" style={{ aspectRatio: 1, borderRadius: theme.borderRadius }}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="color-white-hue" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#ffffff" />
                <Stop offset="1" stopColor={hueToHex(selection.hue)} />
              </LinearGradient>
              <LinearGradient id="color-transparent-black" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                <Stop offset="1" stopColor="#000000" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect width="100" height="100" fill="url(#color-white-hue)" />
            <Rect width="100" height="100" fill="url(#color-transparent-black)" />
          </Svg>
          <View pointerEvents="none" style={{ position: "absolute", left: `${selection.saturation * 100}%`, top: `${(1 - selection.value) * 100}%`, width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: theme.borderRadius, borderWidth: 2, borderColor: "#ffffff", backgroundColor: "transparent", shadowColor: "#000000", shadowOpacity: 0.65, shadowRadius: 2, elevation: 3 }} />
        </View>
        <View className="mt-4">
          <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="mb-2 text-[10px] font-bold">Matiz</Text>
          <View onLayout={(event) => setHueWidth(event.nativeEvent.layout.width)} {...hueResponder.panHandlers} accessibilityRole="adjustable" accessibilityLabel="Matiz da cor" className="h-8 justify-center">
            <View className="h-4 overflow-hidden" style={{ borderRadius: theme.borderRadius }}>
              <Svg width="100%" height="16" viewBox="0 0 100 16" preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="color-hue-spectrum" x1="0" y1="0" x2="1" y2="0">
                    {hueStops.map((hue) => <Stop key={hue} offset={`${hue / 360}`} stopColor={hueToHex(hue)} />)}
                  </LinearGradient>
                </Defs>
                <Rect width="100" height="16" fill="url(#color-hue-spectrum)" />
              </Svg>
            </View>
            <View pointerEvents="none" style={{ position: "absolute", left: `${(selection.hue / 360) * 100}%`, width: 20, height: 20, marginLeft: -10, borderRadius: theme.borderRadius, backgroundColor: hueToHex(selection.hue), borderColor: "#ffffff", borderWidth: 2, elevation: 3 }} />
          </View>
        </View>
        <View className="mt-4 flex-row items-center gap-3">
          <View accessibilityLabel={`Prévia da cor ${selectedColor}`} className="h-11 w-11 rounded-lg" style={{ backgroundColor: selectedColor, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }} />
          <View className="flex-1">
            <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="mb-1 text-[9px] font-bold">CÓDIGO HEX</Text>
            <TextInput accessibilityLabel="Código hexadecimal da cor" value={hexText} onChangeText={updateHex} onBlur={() => {
              if (!/^#[0-9A-F]{6}$/.test(hexTextRef.current)) {
                const current = hsvToHex(selectionRef.current).toUpperCase();
                setHexText(current);
                hexTextRef.current = current;
              }
            }} autoCapitalize="characters" maxLength={7} style={[inputDynamic(theme), { textAlign: "center", paddingVertical: 8 }]} />
          </View>
        </View>
        </ScrollView>
        <View className="mt-5 flex-row justify-end gap-2">
          <Action theme={theme} secondary onPress={close}>Cancelar</Action>
          <Action theme={theme} onPress={confirm}>Usar cor</Action>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  </Modal>;
}
