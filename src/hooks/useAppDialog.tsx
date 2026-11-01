import React, { useCallback, useState } from "react";
import { Modal, Text, View } from "react-native";
import { ThemeSettings } from "../stores/themeStore";
import { Action } from "../components/ui";
import { fontFamily } from "../utils/theme";

export type AppDialogAction = { text: string; style?: "cancel" | "destructive"; onPress?: () => void };
export type AppDialogOptions = { title: string; message: string; actions: AppDialogAction[] };

export function useAppDialog(theme: ThemeSettings) {
  const [dialog, setDialog] = useState<AppDialogOptions | null>(null);
  const showDialog = useCallback((options: AppDialogOptions) => setDialog(options), []);
  const closeDialog = useCallback(() => setDialog(null), []);
  const dialogModal = dialog ? <Modal transparent animationType="fade" visible onRequestClose={closeDialog}>
    <View className="flex-1 justify-center bg-black/60 px-6">
      <View className="w-full self-center p-5" style={{ maxWidth: 380, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }}>
        <Text style={{ color: theme.text, fontFamily: fontFamily(theme.font) }} className="text-base font-black">{dialog.title}</Text>
        <Text style={{ color: theme.muted, fontFamily: fontFamily(theme.font) }} className="mt-2 text-xs leading-5">{dialog.message}</Text>
        <View className="mt-5 flex-row flex-wrap justify-end gap-2">
          {dialog.actions.map((action, index) => <Action key={`${action.text}-${index}`} theme={theme} secondary={action.style === "cancel"} danger={action.style === "destructive"} onPress={() => { closeDialog(); action.onPress?.(); }}>{action.text}</Action>)}
        </View>
      </View>
    </View>
  </Modal> : null;
  return { showDialog, dialogModal };
}
