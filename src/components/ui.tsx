import React, { useEffect, useRef } from "react";
import { Keyboard, Pressable, ScrollView, Text, View, type ScrollViewInstance, type ScrollViewProps } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { ThemeSettings } from "../stores/themeStore";
import { cardStyle, fontFamily } from "../utils/theme";

export type AppIconName = "plus" | "minus" | "chevronDown" | "chevronUp" | "chevronLeft" | "chevronRight" | "more" | "close" | "eye" | "eyeOff" | "settings" | "help" | "palette" | "download" | "upload" | "arrowUp" | "arrowUpRight" | "check" | "pencil" | "trash" | "clock" | "calendar" | "document" | "drive" | "github" | "board" | "overview" | "backlog" | "tasks";

export function AppIcon({ name, size = 20, color, strokeWidth = 2.2 }: { name: AppIconName; size?: number; color: string; strokeWidth?: number }) {
  const common = { fill: "none" as const, stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <Svg width={size} height={size} viewBox="0 0 24 24">
    {name === "plus" ? <Path d="M12 5v14M5 12h14" {...common} /> : null}
    {name === "minus" ? <Path d="M5 12h14" {...common} /> : null}
    {name === "chevronDown" ? <Path d="m6 9 6 6 6-6" {...common} /> : null}
    {name === "chevronUp" ? <Path d="m6 15 6-6 6 6" {...common} /> : null}
    {name === "chevronLeft" ? <Path d="m15 6-6 6 6 6" {...common} /> : null}
    {name === "chevronRight" ? <Path d="m9 6 6 6-6 6" {...common} /> : null}
    {name === "more" ? <><Circle cx={5} cy={12} r={1.2} fill={color} /><Circle cx={12} cy={12} r={1.2} fill={color} /><Circle cx={19} cy={12} r={1.2} fill={color} /></> : null}
    {name === "close" ? <Path d="m6 6 12 12M18 6 6 18" {...common} /> : null}
    {name === "eye" ? <><Path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" {...common} /><Circle cx={12} cy={12} r={2.5} {...common} /></> : null}
    {name === "eyeOff" ? <><Path d="M3 3 21 21M10.6 6.2A10.6 10.6 0 0 1 12 6c6.1 0 9.5 6 9.5 6a15 15 0 0 1-3.1 3.7M6.2 6.3C3.8 7.8 2.5 12 2.5 12s3.4 6 9.5 6c1.1 0 2.1-.2 3-.5" {...common} /><Path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" {...common} /></> : null}
    {name === "settings" ? <><Path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" {...common} /><Path d="m19.4 13.5 1.1.8-1.2 2.1-1.3-.5a7.8 7.8 0 0 1-1.5.9l-.2 1.4h-2.5l-.3-1.4a7.8 7.8 0 0 1-1.5-.9l-1.3.5-1.2-2.1 1.1-.8a7.1 7.1 0 0 1 0-1.8l-1.1-.8 1.2-2.1 1.3.5a7.8 7.8 0 0 1 1.5-.9l.3-1.4h2.5l.2 1.4a7.8 7.8 0 0 1 1.5.9l1.3-.5 1.2 2.1-1.1.8a7.1 7.1 0 0 1 0 1.8Z" transform="translate(-1.5 -2)" {...common} /></> : null}
    {name === "help" ? <><Circle cx={12} cy={12} r={9} {...common} /><Path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.1 1-1.8 1.4-1.8 3.2" {...common} /><Circle cx={12} cy={17.5} r={0.7} fill={color} /></> : null}
    {name === "palette" ? <><Path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.5-3.3 1.5 1.5 0 0 1 1.2-2.5H18a3 3 0 0 0 3-3c0-5.1-4-9.2-9-9.2Z" {...common} /><Circle cx={7.5} cy={11} r={0.8} fill={color} /><Circle cx={10} cy={7.5} r={0.8} fill={color} /><Circle cx={14} cy={7.5} r={0.8} fill={color} /></> : null}
    {name === "download" ? <><Path d="M12 3v12m-5-5 5 5 5-5M5 19h14" {...common} /></> : null}
    {name === "upload" ? <><Path d="M12 16V4m-5 5 5-5 5 5M5 20h14" {...common} /></> : null}
    {name === "arrowUp" ? <Path d="M12 19V5m-7 7 7-7 7 7" {...common} /> : null}
    {name === "arrowUpRight" ? <Path d="M7 17 17 7M8 7h9v9" {...common} /> : null}
    {name === "check" ? <Path d="m5 12 4.5 4.5L19 7" {...common} /> : null}
    {name === "clock" ? <><Circle cx={12} cy={12} r={9} {...common} /><Path d="M12 7v5l3 2" {...common} /></> : null}
    {name === "calendar" ? <><Rect x={3.5} y={5} width={17} height={16} rx={2} {...common} /><Path d="M7.5 3v4M16.5 3v4M3.5 10h17m-12 4h.01M12 14h.01M15.5 14h.01M7.5 17h.01M12 17h.01" {...common} /></> : null}
    {name === "document" ? <><Path d="M6 3.5h8l4 4v13H6z" {...common} /><Path d="M14 3.5v4h4M9 12h6M9 15.5h6" {...common} /></> : null}
    {name === "drive" ? <><Path d="M8 3.5h5.1l7.1 12.2h-5.1L8 3.5Z" fill="#00AC47" /><Path d="M8 3.5h5.1L6 16.8H.9L8 3.5Z" fill="#4285F4" /><Path d="M6 16.8h14.2l-2.7 4.2H3.4L6 16.8Z" fill="#FFBA00" /></> : null}
    {name === "github" ? <Path d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.78-.25.78-.55v-1.94c-3.18.69-3.85-1.53-3.85-1.53-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.95.1-.74.4-1.25.73-1.54-2.54-.29-5.22-1.27-5.22-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.12 1.17a10.9 10.9 0 0 1 5.68 0c2.16-1.48 3.12-1.17 3.12-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.24 5.64.41.35.77 1.05.77 2.12v3.14c0 .3.21.66.79.55A11.3 11.3 0 0 0 12 .7Z" fill={color} /> : null}
    {name === "pencil" ? <Path d="m4 16.5-.8 4.3 4.3-.8L19.8 7.7a2.1 2.1 0 0 0-3-3L4 16.5ZM14.8 6.7l3 3" {...common} /> : null}
    {name === "trash" ? <Path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" {...common} /> : null}
    {name === "board" ? <><Rect x={3.5} y={4} width={7} height={7} rx={1} {...common} /><Rect x={13.5} y={4} width={7} height={7} rx={1} {...common} /><Rect x={3.5} y={14} width={7} height={6} rx={1} {...common} /><Rect x={13.5} y={14} width={7} height={6} rx={1} {...common} /></> : null}
    {name === "overview" ? <Path d="M3 4v16h18M7 14l4-4 4 3 5-7" {...common} /> : null}
    {name === "backlog" ? <Path d="M5 5h14M5 10h14M5 15h9M5 20h9" {...common} /> : null}
    {name === "tasks" ? <Path d="m4 6 1.5 1.5L8 5m3 1h9M4 12l1.5 1.5L8 11m3 1h9M4 18l1.5 1.5L8 17m3 1h9" {...common} /> : null}
  </Svg>;
}

export function KeyboardAwareScrollView({ onFocusCapture, ...props }: ScrollViewProps) {
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const focusedInput = useRef<number | null>(null);
  const scrollFocusedInput = () => {
    const target = focusedInput.current;
    const scrollView = scrollRef.current;
    if (target == null || !scrollView) return;
    requestAnimationFrame(() => scrollView.scrollResponderScrollNativeHandleToKeyboard(target, 24, true));
  };
  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(scrollFocusedInput, 100);
      setTimeout(scrollFocusedInput, 260);
    });
    return () => {
      subscription.remove();
    };
  }, []);
  return <ScrollView ref={scrollRef} {...props} onFocusCapture={(event) => {
    onFocusCapture?.(event);
    const target = event.nativeEvent.target ?? event.target;
    if (typeof target !== "number") return;
    focusedInput.current = target;
    if (Keyboard.isVisible()) {
      setTimeout(scrollFocusedInput, 100);
      setTimeout(scrollFocusedInput, 260);
    }
  }} onScroll={(event) => {
    props.onScroll?.(event);
  }} style={[{ flexShrink: 1 }, props.style]} scrollEventThrottle={props.scrollEventThrottle ?? 16} />;
}

export function Eyebrow({ theme, children }: { theme: ThemeSettings; children: React.ReactNode }) { return <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font), letterSpacing: 1.5 }} className="text-[9px] font-extrabold">{children}</Text>; }
export function Title({ theme, children }: { theme: ThemeSettings; children: React.ReactNode }) { return <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="my-1 text-2xl font-black">{children}</Text>; }
export function Body({ theme, children, numberOfLines }: { theme: ThemeSettings; children: React.ReactNode; numberOfLines?: number }) { return <Text numberOfLines={numberOfLines} style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[11px] leading-4">{children}</Text>; }
export function Small({ theme, children }: { theme: ThemeSettings; children: React.ReactNode }) { return <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[9px]">{children}</Text>; }
export function SectionTitle({ theme, children }: { theme: ThemeSettings; children: React.ReactNode }) { return <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-sm font-extrabold">{children}</Text>; }
export function Panel({ theme, children }: { theme: ThemeSettings; children: React.ReactNode }) { return <View className="mb-3 p-4" style={cardStyle(theme)}>{children}</View>; }
export function Action({ theme, children, onPress, secondary = false, danger = false, icon }: { theme: ThemeSettings; children: React.ReactNode; onPress: () => void; secondary?: boolean; danger?: boolean; icon?: AppIconName }) { const color = danger || !secondary ? theme.background : theme.text; return <Pressable onPress={onPress} className="min-h-9 items-center justify-center px-3 py-2" style={{ backgroundColor: danger ? theme.danger : secondary ? theme.raised : theme.primary, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>{icon ? <View className="flex-row items-center gap-1.5"><AppIcon name={icon} size={14} color={color} strokeWidth={2.4} /><Text style={{ color, fontFamily: fontFamily(theme.font) }} className="text-[10px] font-extrabold">{children}</Text></View> : <Text style={{ color, fontFamily: fontFamily(theme.font) }} className="text-[10px] font-extrabold">{children}</Text>}</Pressable>; }
export function LinkText({ theme, children, onPress, icon }: { theme: ThemeSettings; children: React.ReactNode; onPress: () => void; icon?: AppIconName }) { return <Pressable onPress={onPress} className="self-start py-1">{icon ? <View className="flex-row items-center gap-1"><Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-[10px] font-bold">{children}</Text><AppIcon name={icon} size={13} color={theme.primary} strokeWidth={2.3} /></View> : <Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="text-[10px] font-bold">{children}</Text>}</Pressable>; }
export function Field({ label, theme, children }: { label: string; theme: ThemeSettings; children: React.ReactNode }) { return <View className="mb-3"><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mb-1.5 text-xs font-extrabold">{label}</Text>{children}</View>; }
export function ChoiceRow({ options, value, onChange, theme }: { options: { key: string; label: string }[] | string[]; value: string; onChange: (value: string) => void; theme: ThemeSettings }) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>{options.map((option) => { const key = typeof option === "string" ? option : option.key; const label = typeof option === "string" ? option : option.label; const active = value === key; return <Pressable key={key} onPress={() => onChange(key)} className="px-2.5 py-2" style={{ backgroundColor: active ? theme.primary : theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Text style={{ color: active ? theme.background : theme.text, fontFamily: fontFamily(theme.font) }} className="text-[9px] font-bold">{label}</Text></Pressable>; })}</ScrollView>; }
export function CloseButton({ theme, onPress }: { theme: ThemeSettings; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel="Fechar" hitSlop={8} onPress={onPress} className="h-9 w-9 shrink-0 items-center justify-center" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><AppIcon name="close" size={17} color={theme.text} /></Pressable>; }
export function Fact({ label, value, theme }: { label: string; value: string; theme: ThemeSettings }) { return <View className="mb-2 flex-row"><Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="w-28 text-[10px]">{label}</Text><Text selectable style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="flex-1 text-[10px]">{value}</Text></View>; }
