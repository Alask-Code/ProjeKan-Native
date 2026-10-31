import { Linking, ImageSourcePropType } from "react-native";
import { ThemeSettings } from "../stores/themeStore";

export function isDark(color: string) { return color.toLowerCase() === "#000000" || ["#17131d", "#101923", "#111a17", "#201713", "#111318", "#17140d", "#282a36", "#080b0d", "#1e1e1e"].includes(color.toLowerCase()); }
export function themeSettingsEqual(left: ThemeSettings, right: ThemeSettings) { return (Object.keys(right) as (keyof ThemeSettings)[]).every((key) => left[key] === right[key]); }
export function themePaletteEqual(left: ThemeSettings, right: ThemeSettings) { const keys: (keyof ThemeSettings)[] = ["primary", "background", "surface", "raised", "text", "muted", "border", "danger", "success", "warning", "info"]; return keys.every((key) => left[key] === right[key]); }
export function openExternalUrl(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    void Linking.openURL(url).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}
export function imageSource(image: string | number): ImageSourcePropType { return typeof image === "number" ? image : { uri: image }; }
export function fontFamily(font: string) { const normalized = font.toLowerCase(); return normalized.includes("press start 2p") ? "PressStart2P" : normalized.includes("mono") || normalized.includes("courier") ? "monospace" : normalized.includes("georgia") ? "Georgia" : normalized.includes("archivo") ? "Archivo" : normalized.includes("inter") ? "Inter" : normalized.includes("rajdhani") ? "Rajdhani" : undefined; }
export function cardStyle(theme: ThemeSettings) { return { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }; }
export function pieSlicePath(cx: number, cy: number, radius: number, percentage: number) {
  const angle = (percentage / 100) * Math.PI * 2 - Math.PI / 2;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  const largeArc = percentage > 50 ? 1 : 0;
  return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y} L ${cx} ${cy} Z`;
}
export function inputDynamic(theme: ThemeSettings) { return { backgroundColor: theme.raised, color: theme.text, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, paddingHorizontal: 11, paddingVertical: 10, fontFamily: fontFamily(theme.font), fontSize: 12 } as const; }
