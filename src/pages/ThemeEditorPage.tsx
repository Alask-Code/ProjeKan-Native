import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import useThemeStore, { defaultTheme, themePresets, ThemeSettings } from "../stores/themeStore";
import brandMark from "../assets/projekan-mark.png";
import { colors, fonts } from "../constants/app";
import { Action, AppIcon, Body, Eyebrow, KeyboardAwareScrollView, Panel, SectionTitle, Small, Title } from "../components/ui";
import Stepper from "../components/theme/Stepper";
import ColorSpectrumPicker from "../components/theme/ColorSpectrumPicker";
import { fontFamily, inputDynamic, themePaletteEqual, themeSettingsEqual } from "../utils/theme";
export function ThemeEditorScreen({ theme, onDirtyChange }: { theme: ThemeSettings; onDirtyChange?: (dirty: boolean) => void }) {
  const { height: windowHeight } = useWindowDimensions();
  const [paletteModalHeight, setPaletteModalHeight] = useState(windowHeight);
  const savedSettings = useThemeStore((state) => state.settings);
  const saveSettings = useThemeStore((state) => state.saveSettings);
  const [draft, setDraft] = useState<ThemeSettings>(() => ({ ...savedSettings }));
  const [saved, setSaved] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const update = (key: keyof ThemeSettings, value: string | number) => { const next = { ...draft, [key]: value }; setDraft(next); onDirtyChange?.(!themeSettingsEqual(next, savedSettings)); setSaved(false); };
  const selectedPreset = themePresets.find((preset) => themePaletteEqual(draft, preset.settings));
  const [activeColor, setActiveColor] = useState<(typeof colors)[number] | null>(null);
  const [showInterfaceColors, setShowInterfaceColors] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [showSpectrumPicker, setShowSpectrumPicker] = useState(false);
  const colorChoices = ["#17131d", "#1e1826", "#33263f", "#a77ec3", "#eadcf5", "#b59bc9", "#76568f", "#d26f83", "#61b58a", "#d7ad58", "#7da5da", "#101923", "#172330", "#223448", "#66a8d1", "#dcecf7", "#466b88", "#111a17", "#19251f", "#26392f", "#69b48e", "#e0f0e7", "#557866", "#201713", "#2b1e19", "#483027", "#db916b", "#f5e3d8", "#956449", "#111318", "#1a1d24", "#292d36", "#8b96a8", "#e6e8ec", "#ed7278", "#62bd91", "#dfb85d"];
  return <KeyboardAwareScrollView className="flex-1" scrollEnabled={!showPresetMenu} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"} contentContainerStyle={{ padding: 18, paddingBottom: 28 }}>
    <View className="mb-5"><Eyebrow theme={theme}>PERSONALIZAÇÃO</Eyebrow><Title theme={theme}>Editor de temas</Title><Body numberOfLines={1} theme={theme}>Personalize cores, bordas e tipografia. Salve para aplicar as alterações em todo o espaço.</Body></View>
    <View className="mb-4 flex-row flex-wrap gap-2"><Action theme={theme} secondary onPress={() => { setDraft({ ...defaultTheme }); onDirtyChange?.(!themeSettingsEqual(defaultTheme, savedSettings)); setSaved(false); }}>Restaurar padrão</Action><Action theme={theme} icon="check" onPress={() => { saveSettings({ ...draft }); onDirtyChange?.(false); setSaved(true); }}>{saved ? "Salvo" : "Salvar alterações"}</Action></View>
    <Panel theme={theme}>
      <View className="mb-3 flex-row items-center justify-between"><View className="flex-1 pr-2"><SectionTitle theme={theme}>Prévia</SectionTitle><Body theme={theme}>Uma amostra da aparência atual do app com este tema.</Body></View><View className="px-2 py-1" style={{ backgroundColor: theme.raised, borderRadius: theme.borderRadius }}><Small theme={theme}>RASCUNHO</Small></View></View>
      <View style={{ overflow: "hidden", backgroundColor: draft.background, borderColor: draft.border, borderWidth: draft.borderWidth, borderRadius: draft.borderRadius }}>
        <View className="flex-row items-center justify-between px-3 py-2.5" style={{ backgroundColor: draft.surface, borderBottomColor: draft.border, borderBottomWidth: draft.borderWidth }}>
          <View className="flex-row items-center gap-2"><Image source={brandMark} resizeMode="contain" className="h-7 w-7" /><View><Text style={{ color: draft.text, fontFamily: fontFamily(draft.font) }} className="text-xs font-black">ProjeKan Manager</Text><Text style={{ color: draft.muted, fontFamily: fontFamily(draft.font) }} className="text-[8px]">Quadro</Text></View></View>
          <View className="h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: draft.raised, borderColor: draft.border, borderWidth: draft.borderWidth }}><Text style={{ color: draft.primary, fontFamily: fontFamily(draft.font) }} className="text-xs font-bold">A</Text></View>
        </View>
        <View className="p-3">
          <Text style={{ color: draft.text, fontFamily: fontFamily(draft.font) }} className="mb-2 text-base font-black">Meus projetos</Text>
          <View className="p-3" style={{ backgroundColor: draft.raised, borderColor: draft.border, borderWidth: draft.borderWidth, borderRadius: draft.borderRadius }}>
            <View className="mb-2 flex-row items-center"><View className="mr-2 h-7 w-7 items-center justify-center" style={{ backgroundColor: draft.surface, borderColor: draft.border, borderWidth: draft.borderWidth, borderRadius: draft.borderRadius }}><Text style={{ color: draft.primary }} className="text-xs font-black">P</Text></View><Text numberOfLines={1} style={{ color: draft.text, fontFamily: fontFamily(draft.font) }} className="flex-1 text-xs font-extrabold">Novo produto</Text><View className="h-2 w-2 rounded-full" style={{ backgroundColor: draft.warning }} /></View>
            <Text numberOfLines={2} style={{ color: draft.muted, fontFamily: fontFamily(draft.font) }} className="mb-2 text-[10px]">Organizando as próximas entregas do projeto.</Text>
            <View className="flex-row items-center justify-between"><Text style={{ color: draft.muted, fontFamily: fontFamily(draft.font) }} className="text-[8px]">Em progresso</Text><View className="px-2 py-1" style={{ backgroundColor: draft.surface, borderRadius: draft.borderRadius }}><Text style={{ color: draft.warning, fontFamily: fontFamily(draft.font) }} className="text-[8px] font-bold">Prioridade média</Text></View></View>
          </View>
          <View className="mt-2 flex-row gap-2"><View className="flex-1 p-2" style={{ backgroundColor: draft.surface, borderColor: draft.border, borderWidth: draft.borderWidth, borderRadius: draft.borderRadius }}><Small theme={draft}>CONCLUÍDOS</Small><Text style={{ color: draft.text, fontFamily: fontFamily(draft.font) }} className="mt-1 text-base font-black">3</Text></View><View className="flex-1 p-2" style={{ backgroundColor: draft.surface, borderColor: draft.border, borderWidth: draft.borderWidth, borderRadius: draft.borderRadius }}><Small theme={draft}>EM ANDAMENTO</Small><Text style={{ color: draft.text, fontFamily: fontFamily(draft.font) }} className="mt-1 text-base font-black">2</Text></View></View>
        </View>
        <View className="flex-row justify-around border-t px-1 py-2" style={{ backgroundColor: draft.surface, borderColor: draft.border, borderTopWidth: draft.borderWidth }}>{[{ label: "Quadro", icon: "board" as const }, { label: "Visão geral", icon: "overview" as const }, { label: "Backlog", icon: "backlog" as const }, { label: "Tarefas", icon: "tasks" as const }].map((item, index) => <View key={item.label} className="flex-1 items-center"><AppIcon name={item.icon} size={16} color={index === 0 ? draft.primary : draft.muted} /><Text numberOfLines={1} style={{ color: index === 0 ? draft.primary : draft.muted, fontFamily: fontFamily(draft.font) }} className="mt-1 text-[7px] font-bold">{item.label}</Text></View>)}</View>
      </View>
      <View className="mt-3"><Body theme={theme}>Para aplicar ao restante do app, clique em Salvar alterações.</Body></View>
    </Panel>
    <View className="mb-3 p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, zIndex: showPresetMenu ? 1000 : 0, elevation: showPresetMenu ? 1000 : 0 }}><View className="mb-3"><SectionTitle theme={theme}>Temas prontos</SectionTitle><Body theme={theme}>Escolha uma paleta como ponto de partida.</Body></View>
      <View style={{ position: "relative", zIndex: 1001, elevation: 1001 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Selecionar tema pronto" accessibilityState={{ expanded: showPresetMenu }} onPress={() => setShowPresetMenu(!showPresetMenu)} className="h-11 flex-row items-center justify-between px-3" style={{ backgroundColor: theme.raised, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Text numberOfLines={1} style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs font-bold">{selectedPreset?.name ?? "Personalizado"}</Text><AppIcon name={showPresetMenu ? "chevronUp" : "chevronDown"} size={18} color={theme.primary} /></Pressable>
        {showPresetMenu ? <Modal transparent animationType="fade" visible onRequestClose={() => setShowPresetMenu(false)}><View className="flex-1 justify-center px-6" style={{ backgroundColor: "transparent" }}><View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.background, opacity: 0.55 }} /><Pressable accessibilityRole="button" accessibilityLabel="Fechar temas prontos" onPress={() => setShowPresetMenu(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} /><View style={{ maxHeight: 320, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, overflow: "hidden", elevation: 24 }}><ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator persistentScrollbar keyboardShouldPersistTaps="handled">{themePresets.map((preset) => { const selected = themePaletteEqual(draft, preset.settings); return <Pressable key={preset.id} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => { const next = { ...preset.settings }; setDraft(next); onDirtyChange?.(!themeSettingsEqual(next, savedSettings)); setSaved(false); setShowPresetMenu(false); }} className="flex-row items-center gap-3 px-3 py-3" style={{ minHeight: 48, backgroundColor: selected ? theme.primary : theme.surface, borderBottomColor: theme.border, borderBottomWidth: theme.borderWidth }}><View className="flex-row items-center gap-1">{[preset.settings.primary, preset.settings.surface, preset.settings.background].map((color, index) => <View key={index} className="h-4 w-4" style={{ backgroundColor: color, borderColor: preset.settings.border, borderWidth: preset.settings.borderWidth, borderRadius: preset.settings.borderRadius }} />)}</View><Text numberOfLines={1} style={{ color: selected ? theme.background : theme.text, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs font-bold">{preset.name}</Text>{selected ? <AppIcon name="check" size={16} color={theme.background} /> : null}</Pressable>; })}</ScrollView></View></View></Modal> : null}
      </View>
    </View>
        <Panel theme={theme}><Pressable accessibilityRole="button" accessibilityState={{ expanded: showInterfaceColors }} onPress={() => setShowInterfaceColors((open) => !open)} className="flex-row items-center justify-between"><View className="flex-1 pr-3"><SectionTitle theme={theme}>Cores da interface</SectionTitle><Body theme={theme}>Toque para ver e editar as cores.</Body></View><AppIcon name={showInterfaceColors ? "chevronUp" : "chevronDown"} size={18} color={theme.primary} /></Pressable>{showInterfaceColors ? <View className="mt-2">{colors.map((color) => <Pressable key={color.key} accessibilityRole="button" accessibilityLabel={`Editar ${color.label}`} onPress={() => setActiveColor(color)} className="mt-2 flex-row items-center gap-3 border-b py-2" style={{ borderColor: theme.border, borderBottomWidth: theme.borderWidth }}><View className="h-9 w-9" style={{ backgroundColor: String(draft[color.key]), borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }} /><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs">{color.label}</Text><Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="text-[10px]">{String(draft[color.key]).toUpperCase()}</Text><AppIcon name="chevronDown" size={16} color={theme.muted} /></Pressable>)}</View> : null}</Panel>
    <Modal transparent animationType="fade" visible={activeColor !== null && !showSpectrumPicker} onRequestClose={() => setActiveColor(null)}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View onLayout={(event) => setPaletteModalHeight(event.nativeEvent.layout.height)} className="flex-1 justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar seletor de cor" onPress={() => setActiveColor(null)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <View className="p-4" style={{ height: Math.min(paletteModalHeight * 0.8, 560), flexDirection: "column", backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, elevation: 24 }}>
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-1 pr-2"><SectionTitle theme={theme}>{activeColor?.label ?? "Escolher cor"}</SectionTitle><Body theme={theme}>Escolha uma amostra ou digite o código hexadecimal.</Body></View>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={() => setActiveColor(null)}><AppIcon name="close" size={20} color={theme.text} /></Pressable>
          </View>
          {activeColor ? <>
            <View className="mb-3 flex-row items-center gap-3">
              <Pressable accessibilityRole="button" accessibilityLabel="Abrir seletor RGB" onPress={() => setShowSpectrumPicker(true)} className="h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: String(draft[activeColor.key]), borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><AppIcon name="pencil" size={15} color={theme.background} /></Pressable>
              <TextInput accessibilityLabel="Código hexadecimal da cor" value={String(draft[activeColor.key])} onChangeText={(value) => update(activeColor.key, value)} autoCapitalize="characters" maxLength={7} style={[inputDynamic(theme), { flex: 1, paddingVertical: 9, textAlign: "center" }]} />
            </View>
            <ScrollView style={{ flex: 1, minHeight: 0 }} showsVerticalScrollIndicator keyboardShouldPersistTaps="handled">
              <View className="flex-row flex-wrap gap-2">{colorChoices.map((value) => { const selected = String(draft[activeColor.key]).toLowerCase() === value.toLowerCase(); return <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`Usar cor ${value}`} onPress={() => update(activeColor.key, value)} className="h-9 w-9 items-center justify-center" style={{ backgroundColor: value, borderColor: selected ? theme.text : theme.border, borderWidth: 2, borderRadius: theme.borderRadius }}>{selected ? <AppIcon name="check" size={16} color={theme.text} /> : null}</Pressable>; })}</View>
            </ScrollView>
            <View className="mt-3 flex-row items-center gap-2">
              <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="flex-1 text-[9px]">Toque na cor para abrir o espectro RGB.</Text>
              <View className="shrink-0">
                <Action theme={theme} onPress={() => setActiveColor(null)}>Concluir</Action>
              </View>
            </View>
          </> : null}
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
    <ColorSpectrumPicker visible={showSpectrumPicker && activeColor !== null} color={activeColor ? String(draft[activeColor.key]) : "#000000"} label={activeColor?.label ?? "Escolher cor"} theme={theme} onClose={() => setShowSpectrumPicker(false)} onApply={(value) => { if (activeColor) update(activeColor.key, value); }} />
    <Panel theme={theme}><Pressable accessibilityRole="button" accessibilityState={{ expanded: showTypography }} onPress={() => setShowTypography((open) => !open)} className="flex-row items-center justify-between"><View className="flex-1 pr-3"><SectionTitle theme={theme}>Forma e tipografia</SectionTitle><Body theme={theme}>Defina o acabamento dos componentes.</Body></View><AppIcon name={showTypography ? "chevronUp" : "chevronDown"} size={18} color={theme.primary} /></Pressable>{showTypography ? <View className="mt-3"><Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mb-2 mt-1 text-xs font-bold">Fonte da interface</Text><View className="flex-row flex-wrap gap-2">{fonts.map((font) => { const active = draft.font === font; return <Pressable key={font} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => update("font", font)} className="px-3 py-2" style={{ backgroundColor: active ? theme.primary : theme.raised, borderColor: active ? theme.primary : theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}><Text style={{ color: active ? theme.background : theme.text, fontFamily: fontFamily(font) }} className="text-[10px] font-bold">{font.split(",")[0].replaceAll('"', "")}</Text></Pressable>; })}</View><Stepper theme={theme} label="Arredondamento" value={draft.borderRadius} min={0} max={24} onChange={(value) => update("borderRadius", value)} suffix="px" /><Stepper theme={theme} label="Espessura das bordas" value={draft.borderWidth} min={0} max={5} onChange={(value) => update("borderWidth", value)} suffix="px" /></View> : null}</Panel>
  </KeyboardAwareScrollView>;
}






