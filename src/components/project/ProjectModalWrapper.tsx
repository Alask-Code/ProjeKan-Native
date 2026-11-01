import React from "react";
import { KeyboardAvoidingView, Modal, Platform, View } from "react-native";
import { ThemeSettings } from "../../stores/themeStore";

export function ProjectModalWrapper({ visible, theme, onClose, children }: { visible: boolean; theme: ThemeSettings; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.6)" }}>
        <View style={{ height: "94%", backgroundColor: theme.background, borderColor: theme.border, borderTopWidth: theme.borderWidth, borderTopLeftRadius: theme.borderRadius, borderTopRightRadius: theme.borderRadius, overflow: "hidden" }}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
