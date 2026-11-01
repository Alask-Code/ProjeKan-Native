import React from "react";
import { Text, View } from "react-native";
import { ThemeSettings } from "../../stores/themeStore";
import { AppIcon, Body, SectionTitle } from "../ui";
import { fontFamily } from "../../utils/theme";
import type { ReleaseNotes } from "../../utils/changelog";

export default function ReleaseNotesSection({ theme, releaseNotes }: { theme: ThemeSettings; releaseNotes: ReleaseNotes[] }) {
  return <View className="mb-3 p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
    <View className="mb-2 flex-row items-center gap-2"><AppIcon name="overview" size={17} color={theme.primary} /><SectionTitle theme={theme}>O que há de novo</SectionTitle></View>
    {releaseNotes.length ? releaseNotes.map((section) => <View key={section.version} className="mt-3">
      <Text style={{ color: theme.primary, fontFamily: fontFamily(theme.font) }} className="mb-2 text-sm font-extrabold">Versão {section.version}</Text>
      {section.categories.length ? section.categories.map((category) => <View key={`${section.version}-${category.name}`} className="mb-3">
        <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="mb-1 text-[10px] font-extrabold">{category.name}</Text>
        {category.notes.length ? category.notes.map((note, index) => <View key={`${section.version}-${category.name}-${index}`} className="mb-1 flex-row items-start gap-2">
          <Text style={{ color: theme.primary }} className="text-xs">•</Text>
          <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="flex-1 text-xs leading-4">{note}</Text>
        </View>) : <Body theme={theme}>Nenhuma alteração nesta categoria.</Body>}
      </View>) : <Body theme={theme}>Nenhuma nota foi publicada para esta versão.</Body>}
    </View>) : <Body theme={theme}>Não há notas de versão no CHANGELOG.md.</Body>}
  </View>;
}
